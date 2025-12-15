import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import {
  Restaurant,
  RestaurantCategory,
  RestaurantCategoryMapping,
  MenuCategory,
  MenuItem,
  MenuItemOption,
  OperatingHours
} from '@backend/database';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(RestaurantCategory)
    private readonly categoryRepository: Repository<RestaurantCategory>,
    @InjectRepository(RestaurantCategoryMapping)
    private readonly mappingRepository: Repository<RestaurantCategoryMapping>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuItemOption)
    private readonly optionRepository: Repository<MenuItemOption>,
    @InjectRepository(OperatingHours)
    private readonly hoursRepository: Repository<OperatingHours>,
  ) {}

  async findAll(query: any) {
    const { search, category_id, latitude, longitude, radius_km, min_rating, is_open, is_featured, page = 1, limit = 20, sort_by = 'created_at', sort_order = 'DESC' } = query;

    const queryBuilder = this.restaurantRepository.createQueryBuilder('restaurant');

    if (search) {
      queryBuilder.andWhere('restaurant.name LIKE :search OR restaurant.description LIKE :search', { search: `%${search}%` });
    }

    if (category_id) {
      queryBuilder.innerJoin('restaurant_category_mappings', 'mapping', 'mapping.restaurant_id = restaurant.id')
        .andWhere('mapping.category_id = :category_id', { category_id });
    }

    if (min_rating) {
      queryBuilder.andWhere('restaurant.average_rating >= :min_rating', { min_rating });
    }

    if (is_open !== undefined) {
      queryBuilder.andWhere('restaurant.is_open = :is_open', { is_open });
    }

    if (is_featured !== undefined) {
      queryBuilder.andWhere('restaurant.is_featured = :is_featured', { is_featured });
    }

    queryBuilder.andWhere('restaurant.status = :status', { status: 'APPROVED' });

    const total = await queryBuilder.getCount();

    queryBuilder
      .orderBy(`restaurant.${sort_by}`, sort_order as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const data = await queryBuilder.getMany();

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['operating_hours'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async create(ownerId: string, data: any) {
    const restaurant = this.restaurantRepository.create({
      ...data,
      owner_id: ownerId,
    });

    return this.restaurantRepository.save(restaurant);
  }

  async update(id: string, ownerId: string, data: any) {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.owner_id !== ownerId) {
      throw new ForbiddenException('Not authorized to update this restaurant');
    }

    Object.assign(restaurant, data);
    return this.restaurantRepository.save(restaurant);
  }

  async toggleStatus(id: string, ownerId: string) {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.owner_id !== ownerId) {
      throw new ForbiddenException('Not authorized to update this restaurant');
    }

    restaurant.is_open = !restaurant.is_open;
    return this.restaurantRepository.save(restaurant);
  }

  async getMenu(restaurantId: string) {
    const categories = await this.menuCategoryRepository.find({
      where: { restaurant_id: restaurantId, is_active: true },
      order: { display_order: 'ASC' },
    });

    const menu = [];

    for (const category of categories) {
      const items = await this.menuItemRepository.find({
        where: { category_id: category.id },
        order: { display_order: 'ASC' },
      });

      const itemsWithOptions = [];

      for (const item of items) {
        const options = await this.optionRepository.find({
          where: { menu_item_id: item.id, is_available: true },
        });

        itemsWithOptions.push({
          ...item,
          options,
        });
      }

      menu.push({
        ...category,
        items: itemsWithOptions,
      });
    }

    return menu;
  }

  async createMenuCategory(data: any) {
    const category = this.menuCategoryRepository.create(data);
    return this.menuCategoryRepository.save(category);
  }

  async updateMenuCategory(id: string, data: any) {
    const category = await this.menuCategoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Menu category not found');
    }

    Object.assign(category, data);
    return this.menuCategoryRepository.save(category);
  }

  async deleteMenuCategory(id: string) {
    const result = await this.menuCategoryRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Menu category not found');
    }

    return { message: 'Menu category deleted successfully' };
  }

  async createMenuItem(data: any) {
    const item = this.menuItemRepository.create(data);
    return this.menuItemRepository.save(item);
  }

  async updateMenuItem(id: string, data: any) {
    const item = await this.menuItemRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    Object.assign(item, data);
    return this.menuItemRepository.save(item);
  }

  async deleteMenuItem(id: string) {
    const result = await this.menuItemRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Menu item not found');
    }

    return { message: 'Menu item deleted successfully' };
  }

  async createMenuItemOption(data: any) {
    const option = this.optionRepository.create(data);
    return this.optionRepository.save(option);
  }

  async updateMenuItemOption(id: string, data: any) {
    const option = await this.optionRepository.findOne({ where: { id } });

    if (!option) {
      throw new NotFoundException('Menu item option not found');
    }

    Object.assign(option, data);
    return this.optionRepository.save(option);
  }

  async deleteMenuItemOption(id: string) {
    const result = await this.optionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Menu item option not found');
    }

    return { message: 'Menu item option deleted successfully' };
  }

  async getCategories() {
    return this.categoryRepository.find({
      order: { display_order: 'ASC' },
    });
  }

  async updateOperatingHours(restaurantId: string, hours: any[]) {
    await this.hoursRepository.delete({ restaurant_id: restaurantId });

    const operatingHours = hours.map(h =>
      this.hoursRepository.create({
        ...h,
        restaurant_id: restaurantId,
      })
    );

    return this.hoursRepository.save(operatingHours);
  }
}
