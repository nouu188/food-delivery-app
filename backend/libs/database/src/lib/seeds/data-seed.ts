import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  User,
  Restaurant,
  RestaurantCategory,
  RestaurantCategoryMapping,
  MenuCategory,
  MenuItem,
  MenuItemOption,
  OperatingHours,
  Driver,
  Wallet,
  UserAddress,
  Voucher,
  WalletTransaction,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Delivery,
  Payment,
  Review,
  ReviewImage,
  UserFavorite,
} from '../entities';
import {
  UserRole,
  UserStatus,
  RestaurantStatus,
  VehicleType,
  DriverStatus,
  DiscountType,
  WalletTransactionType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  DeliveryStatus,
} from '@backend/shared';

export async function seedDatabase(dataSource: DataSource) {
  console.log('Starting database seeding...');

  // Clear existing data
  console.log('Clearing existing data...');
  await dataSource.query('TRUNCATE TABLE review_images CASCADE');
  await dataSource.query('TRUNCATE TABLE reviews CASCADE');
  await dataSource.query('TRUNCATE TABLE user_favorites CASCADE');
  await dataSource.query('TRUNCATE TABLE payments CASCADE');
  await dataSource.query('TRUNCATE TABLE deliveries CASCADE');
  await dataSource.query('TRUNCATE TABLE order_items CASCADE');
  await dataSource.query('TRUNCATE TABLE orders CASCADE');
  await dataSource.query('TRUNCATE TABLE cart_items CASCADE');
  await dataSource.query('TRUNCATE TABLE carts CASCADE');
  await dataSource.query('TRUNCATE TABLE wallet_transactions CASCADE');
  await dataSource.query('TRUNCATE TABLE wallets CASCADE');
  await dataSource.query('TRUNCATE TABLE vouchers CASCADE');
  await dataSource.query('TRUNCATE TABLE user_addresses CASCADE');
  await dataSource.query('TRUNCATE TABLE drivers CASCADE');
  await dataSource.query('TRUNCATE TABLE menu_item_options CASCADE');
  await dataSource.query('TRUNCATE TABLE menu_items CASCADE');
  await dataSource.query('TRUNCATE TABLE menu_categories CASCADE');
  await dataSource.query('TRUNCATE TABLE operating_hours CASCADE');
  await dataSource.query('TRUNCATE TABLE restaurant_category_mappings CASCADE');
  await dataSource.query('TRUNCATE TABLE restaurants CASCADE');
  await dataSource.query('TRUNCATE TABLE restaurant_categories CASCADE');
  await dataSource.query('TRUNCATE TABLE users CASCADE');
  console.log('✓ Cleared existing data');

  const userRepository = dataSource.getRepository(User);
  const restaurantRepository = dataSource.getRepository(Restaurant);
  const restaurantCategoryRepository = dataSource.getRepository(RestaurantCategory);
  const restaurantCategoryMappingRepository = dataSource.getRepository(RestaurantCategoryMapping);
  const menuCategoryRepository = dataSource.getRepository(MenuCategory);
  const menuItemRepository = dataSource.getRepository(MenuItem);
  const menuItemOptionRepository = dataSource.getRepository(MenuItemOption);
  const operatingHoursRepository = dataSource.getRepository(OperatingHours);
  const driverRepository = dataSource.getRepository(Driver);
  const walletRepository = dataSource.getRepository(Wallet);
  const userAddressRepository = dataSource.getRepository(UserAddress);
  const voucherRepository = dataSource.getRepository(Voucher);
  const walletTransactionRepository = dataSource.getRepository(WalletTransaction);
  const cartRepository = dataSource.getRepository(Cart);
  const cartItemRepository = dataSource.getRepository(CartItem);
  const orderRepository = dataSource.getRepository(Order);
  const orderItemRepository = dataSource.getRepository(OrderItem);
  const deliveryRepository = dataSource.getRepository(Delivery);
  const paymentRepository = dataSource.getRepository(Payment);
  const reviewRepository = dataSource.getRepository(Review);
  const reviewImageRepository = dataSource.getRepository(ReviewImage);
  const userFavoriteRepository = dataSource.getRepository(UserFavorite);

  const passwordHash = await bcrypt.hash('password123', 10);

  // ===============================
  // SEED USERS (100 users)
  // ===============================
  console.log('Seeding users...');
  const users: User[] = [];

  // Customers (60)
  for (let i = 1; i <= 60; i++) {
    const user = userRepository.create({
      email: `customer${i}@example.com`,
      phone: `0${900000000 + i}`,
      password_hash: passwordHash,
      full_name: `Customer ${i}`,
      avatar_url: `https://i.pravatar.cc/150?img=${i}`,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
      last_login_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    });
    users.push(user);
  }

  // Restaurant Owners (30)
  for (let i = 1; i <= 30; i++) {
    const user = userRepository.create({
      email: `owner${i}@example.com`,
      phone: `0${920000000 + i}`,
      password_hash: passwordHash,
      full_name: `Restaurant Owner ${i}`,
      avatar_url: `https://i.pravatar.cc/150?img=${60 + i}`,
      role: UserRole.RESTAURANT_OWNER,
      status: UserStatus.ACTIVE,
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
      last_login_at: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
    });
    users.push(user);
  }

  // Drivers (9)
  for (let i = 1; i <= 9; i++) {
    const user = userRepository.create({
      email: `driver${i}@example.com`,
      phone: `0${930000000 + i}`,
      password_hash: passwordHash,
      full_name: `Driver ${i}`,
      avatar_url: `https://i.pravatar.cc/150?img=${90 + i}`,
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
      last_login_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
    });
    users.push(user);
  }

  // Admin (1)
  const admin = userRepository.create({
    email: 'admin@example.com',
    phone: '0940000000',
    password_hash: passwordHash,
    full_name: 'System Admin',
    avatar_url: 'https://i.pravatar.cc/150?img=100',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    email_verified_at: new Date(),
    phone_verified_at: new Date(),
    last_login_at: new Date(),
  });
  users.push(admin);

  await userRepository.save(users);
  console.log(`✓ Seeded ${users.length} users`);

  // ===============================
  // SEED RESTAURANT CATEGORIES
  // ===============================
  console.log('Seeding restaurant categories...');
  const restaurantCategories: RestaurantCategory[] = [];
  const categoryData = [
    { name: 'Fast Food', slug: 'fast-food', icon_url: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
    { name: 'Vietnamese', slug: 'vietnamese', icon_url: 'https://cdn-icons-png.flaticon.com/512/2515/2515268.png' },
    { name: 'Japanese', slug: 'japanese', icon_url: 'https://cdn-icons-png.flaticon.com/512/2252/2252080.png' },
    { name: 'Korean', slug: 'korean', icon_url: 'https://cdn-icons-png.flaticon.com/512/3816/3816415.png' },
    { name: 'Italian', slug: 'italian', icon_url: 'https://cdn-icons-png.flaticon.com/512/3480/3480618.png' },
    { name: 'Chinese', slug: 'chinese', icon_url: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png' },
    { name: 'Thai', slug: 'thai', icon_url: 'https://cdn-icons-png.flaticon.com/512/2515/2515183.png' },
    { name: 'Desserts', slug: 'desserts', icon_url: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png' },
    { name: 'Beverages', slug: 'beverages', icon_url: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png' },
    { name: 'Healthy', slug: 'healthy', icon_url: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png' },
  ];

  for (let i = 0; i < categoryData.length; i++) {
    const category = restaurantCategoryRepository.create({
      ...categoryData[i],
      display_order: i,
    });
    restaurantCategories.push(category);
  }

  await restaurantCategoryRepository.save(restaurantCategories);
  console.log(`✓ Seeded ${restaurantCategories.length} restaurant categories`);

  // ===============================
  // SEED RESTAURANTS (50)
  // ===============================
  console.log('Seeding restaurants...');
  const restaurants: Restaurant[] = [];
  const restaurantOwners = users.filter(u => u.role === UserRole.RESTAURANT_OWNER);

  const restaurantNames = [
    'Golden Dragon', 'Pho Saigon', 'Sushi Paradise', 'Pizza Heaven', 'Burger King Street',
    'Taco Fiesta', 'Noodle House', 'BBQ Master', 'Seafood Delights', 'Veggie Garden',
    'Cafe Central', 'Banh Mi Express', 'Ramen Station', 'Steakhouse Premium', 'Curry Palace',
    'Dumpling Dynasty', 'Pasta Roma', 'Grilled & Chilled', 'Sweet Treats', 'Coffee Corner',
    'Bun Bo Hue', 'Tempura Tokyo', 'Kimchi Kitchen', 'Poke Bowl', 'Sandwich Shop',
    'Hotpot Heaven', 'Fried Chicken Co', 'Smoothie Bar', 'Breakfast Club', 'Night Market',
    'Com Tam Moc', 'Udon House', 'Bubble Tea Paradise', 'Grill Master', 'Soup Station',
    'Dim Sum Palace', 'Crepe Corner', 'Waffle Wonder', 'Juice Junction', 'Stir Fry Express',
    'Baguette Bistro', 'Teriyaki Time', 'Bibimbap Bowl', 'Cheesecake Factory', 'Roast & Toast',
    'Spring Rolls', 'Tempura House', 'Kimchi Express', 'Bento Box', 'Wrap & Roll',
  ];

  const addresses = [
    '123 Nguyen Hue St, District 1', '456 Le Loi Blvd, District 3', '789 Tran Hung Dao St, District 5',
    '321 Vo Thi Sau St, District 3', '654 Pasteur St, District 1', '987 Nguyen Trai St, District 5',
    '147 Ly Thuong Kiet St, District 10', '258 Cach Mang Thang 8 St, District 3', '369 Dien Bien Phu St, District 3',
    '741 Ba Thang Hai St, District 10',
  ];

  const REALISTIC_COVERS = [
    "https://images.unsplash.com/photo-1667388969250-1c7220bf3f37?q=80&w=2710&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000", 
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000", 
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000", 
    "https://images.unsplash.com/photo-1729394405518-eaf2a0203aa7?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1000",
  ];

  const REALISTIC_LOGOS = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=500",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=500",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500",
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500",
    "https://images.unsplash.com/photo-1651440204227-a9a5b9d19712?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500",
    "https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZvb2R8ZW58MHx8MHx8fDA%3D",
    "https://plus.unsplash.com/premium_photo-1661777692723-ba8dd05065d9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500",
  ];

  for (let i = 0; i < 50; i++) {
    const owner = restaurantOwners[i % restaurantOwners.length];
    const baseLatitude = 10.762622;
    const baseLongitude = 106.660172;

    const coverUrl = REALISTIC_COVERS[i % REALISTIC_COVERS.length];
    const logoUrl = REALISTIC_LOGOS[i % REALISTIC_LOGOS.length];

    const restaurant = restaurantRepository.create({
      owner_id: owner.id,
      name: restaurantNames[i],
      description: `Delicious ${restaurantNames[i]} serving authentic cuisine with fresh ingredients and great atmosphere.`,
      phone: `0${280000000 + i}`,
      address: addresses[i % addresses.length] + `, Ward ${i % 15 + 1}`,
      latitude: baseLatitude + (Math.random() - 0.5) * 0.1,
      longitude: baseLongitude + (Math.random() - 0.5) * 0.1,
      logo_url: logoUrl,
      cover_image_url: coverUrl,
      average_rating: Number((3.5 + Math.random() * 1.5)),
      total_reviews: Math.floor(Math.random() * 200) + 10,
      min_order_amount: [0, 50000, 100000][Math.floor(Math.random() * 3)],
      delivery_fee: [15000, 20000, 25000, 30000][Math.floor(Math.random() * 4)],
      estimated_prep_time: [15, 20, 25, 30, 35, 40][Math.floor(Math.random() * 6)],
      is_open: Math.random() > 0.2,
      is_featured: i < 10,
      status: RestaurantStatus.APPROVED,
    });
    restaurants.push(restaurant);
  }

  await restaurantRepository.save(restaurants);
  console.log(`✓ Seeded ${restaurants.length} restaurants`);

  // ===============================
  // SEED RESTAURANT CATEGORY MAPPINGS
  // ===============================
  console.log('Seeding restaurant category mappings...');
  const mappings: RestaurantCategoryMapping[] = [];

  for (const restaurant of restaurants) {
    const numCategories = Math.floor(Math.random() * 2) + 1;
    const selectedCategories = restaurantCategories
      .sort(() => 0.5 - Math.random())
      .slice(0, numCategories);

    for (const category of selectedCategories) {
      const mapping = restaurantCategoryMappingRepository.create({
        restaurant_id: restaurant.id,
        category_id: category.id,
      });
      mappings.push(mapping);
    }
  }

  await restaurantCategoryMappingRepository.save(mappings);
  console.log(`✓ Seeded ${mappings.length} restaurant category mappings`);

  // ===============================
  // SEED OPERATING HOURS
  // ===============================
  console.log('Seeding operating hours...');
  const operatingHours: OperatingHours[] = [];

  for (const restaurant of restaurants) {
    for (let day = 0; day < 7; day++) {
      const hours = operatingHoursRepository.create({
        restaurant_id: restaurant.id,
        day_of_week: day,
        open_time: ['08:00:00', '09:00:00', '10:00:00'][Math.floor(Math.random() * 3)],
        close_time: ['20:00:00', '21:00:00', '22:00:00', '23:00:00'][Math.floor(Math.random() * 4)],
        is_closed: day === 0 && Math.random() > 0.7,
      });
      operatingHours.push(hours);
    }
  }

  await operatingHoursRepository.save(operatingHours);
  console.log(`✓ Seeded ${operatingHours.length} operating hours`);

  // ===============================
  // SEED MENU CATEGORIES (150 = 3 per restaurant)
  // ===============================
  console.log('Seeding menu categories...');
  const menuCategories: MenuCategory[] = [];
  const categoryNames = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Specials', 'Combo Meals', 'Sides', 'Salads'];

  for (const restaurant of restaurants) {
    const numCategories = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < numCategories; i++) {
      const menuCategory = menuCategoryRepository.create({
        restaurant_id: restaurant.id,
        name: categoryNames[i % categoryNames.length],
        description: `Delicious ${categoryNames[i % categoryNames.length].toLowerCase()} selection`,
        display_order: i,
        is_active: true,
      });
      menuCategories.push(menuCategory);
    }
  }

  await menuCategoryRepository.save(menuCategories);
  console.log(`✓ Seeded ${menuCategories.length} menu categories`);

  // ===============================
  // SEED MENU ITEMS (500+)
  // ===============================
  const getMenuImageUrl = (itemName: string): string => {
    const name = itemName.toLowerCase();

    if (name.includes('coffee') || name.includes('tea') || name.includes('latte'))
      return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800"; // Coffee/Tea
    if (name.includes('juice') || name.includes('smoothie') || name.includes('milkshake'))
      return "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800"; // Fresh Juice
    if (name.includes('cake') || name.includes('tiramisu') || name.includes('panna cotta') || name.includes('dessert'))
      return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800"; // Cake
    if (name.includes('ice cream') || name.includes('sundae'))
      return "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=800"; // Ice Cream
    if (name.includes('fruit'))
      return "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800"; // Fruit

    if (name.includes('pho') || name.includes('noodle') || name.includes('ramen') || name.includes('bun'))
      return "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800"; // Noodle Soup
    if (name.includes('rice') || name.includes('com tam') || name.includes('bibimbap'))
      return "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    if (name.includes('roll') || name.includes('goi cuon') || name.includes('cha gio'))
      return "https://plus.unsplash.com/premium_photo-1695756121533-3f60bee7ba7b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Spring rolls
    if (name.includes('sushi') || name.includes('sashimi'))
      return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800"; // Sushi

    if (name.includes('pizza'))
      return "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800"; // Pizza
    if (name.includes('burger') || name.includes('sandwich') || name.includes('banh mi'))
      return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800"; // Burger/Banh mi
    if (name.includes('spaghetti') || name.includes('pasta') || name.includes('carbonara'))
      return "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=800"; // Pasta
    if (name.includes('steak') || name.includes('beef') || name.includes('grill'))
      return "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800"; // Steak
    if (name.includes('salad'))
      return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800"; // Salad
    if (name.includes('fish') || name.includes('salmon') || name.includes('lobster') || name.includes('crab') || name.includes('oyster'))
      return "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=800"; // Seafood

    return "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  };

  console.log('Seeding menu items...');
  const menuItems: MenuItem[] = [];
  const itemNames = [
    'Grilled Chicken', 'Beef Steak', 'Fried Rice', 'Spring Rolls', 'Pad Thai', 'Tom Yum Soup',
    'Caesar Salad', 'Margherita Pizza', 'Spaghetti Carbonara', 'Sushi Platter', 'Tempura Set',
    'Ramen Bowl', 'Pho Bo', 'Banh Mi', 'Com Tam', 'Bun Cha', 'Goi Cuon', 'Cha Gio',
    'Bibimbap', 'Kimchi Fried Rice', 'Bulgogi', 'Fish & Chips', 'Burger Deluxe', 'Club Sandwich',
    'Chicken Wings', 'BBQ Ribs', 'Grilled Salmon', 'Lobster Thermidor', 'Crab Cakes', 'Oysters',
    'Tiramisu', 'Panna Cotta', 'Chocolate Lava Cake', 'Ice Cream Sundae', 'Fruit Platter',
    'Iced Coffee', 'Green Tea', 'Smoothie Bowl', 'Fresh Juice', 'Milkshake',
  ];

  for (const menuCategory of menuCategories) {
    const itemsPerCategory = Math.floor(Math.random() * 5) + 5;

    for (let i = 0; i < itemsPerCategory; i++) {
      const currentItemName = itemNames[(menuItems.length + i) % itemNames.length];
      const hasOriginalPrice = Math.random() > 0.7;

      const menuItem = menuItemRepository.create({
        restaurant_id: menuCategory.restaurant_id,
        category_id: menuCategory.id,
        name: itemNames[(menuItems.length + i) % itemNames.length],
        description: `Fresh and delicious ${itemNames[(menuItems.length + i) % itemNames.length]}`,
        price: (Math.floor(Math.random() * 150) + 30) * 1000,
        ...(hasOriginalPrice && { original_price: (Math.floor(Math.random() * 200) + 50) * 1000 }),
        image_url: getMenuImageUrl(currentItemName),
        is_available: Math.random() > 0.1,
        is_featured: Math.random() > 0.8,
        preparation_time: [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)],
        display_order: i,
      });
      menuItems.push(menuItem);
    }
  }

  await menuItemRepository.save(menuItems);
  console.log(`✓ Seeded ${menuItems.length} menu items`);

  // ===============================
  // SEED MENU ITEM OPTIONS (1000+)
  // ===============================
  console.log('Seeding menu item options...');
  const menuItemOptions: MenuItemOption[] = [];
  const optionGroups = ['Size', 'Spice Level', 'Add-ons', 'Toppings', 'Extras'];
  const optionsByGroup: Record<string, Array<{ name: string; modifier: number }>> = {
    Size: [
      { name: 'Small', modifier: 0 },
      { name: 'Medium', modifier: 5000 },
      { name: 'Large', modifier: 10000 },
    ],
    'Spice Level': [
      { name: 'Mild', modifier: 0 },
      { name: 'Medium', modifier: 0 },
      { name: 'Hot', modifier: 0 },
      { name: 'Extra Hot', modifier: 5000 },
    ],
    'Add-ons': [
      { name: 'Extra Cheese', modifier: 10000 },
      { name: 'Bacon', modifier: 15000 },
      { name: 'Avocado', modifier: 20000 },
    ],
    Toppings: [
      { name: 'Mushrooms', modifier: 5000 },
      { name: 'Olives', modifier: 5000 },
      { name: 'Pepperoni', modifier: 10000 },
    ],
    Extras: [
      { name: 'Extra Sauce', modifier: 5000 },
      { name: 'Side Salad', modifier: 15000 },
    ],
  };

  for (const menuItem of menuItems) {
    const numOptionGroups = Math.floor(Math.random() * 2) + 1;
    const selectedGroups = optionGroups.sort(() => 0.5 - Math.random()).slice(0, numOptionGroups);

    for (const group of selectedGroups) {
      const options = optionsByGroup[group];
      for (const option of options) {
        const menuItemOption = menuItemOptionRepository.create({
          menu_item_id: menuItem.id,
          option_group: group,
          name: option.name,
          price_modifier: option.modifier,
          is_required: group === 'Size',
          max_selections: 1,
          is_available: Math.random() > 0.05,
          is_default: option.name === 'Medium' || option.name === 'Mild' || option.modifier === 0,
        });
        menuItemOptions.push(menuItemOption);
      }
    }
  }

  await menuItemOptionRepository.save(menuItemOptions);
  console.log(`✓ Seeded ${menuItemOptions.length} menu item options`);

  // ===============================
  // SEED DRIVERS (50)
  // ===============================
  console.log('Seeding drivers...');
  const drivers: Driver[] = [];
  const driverUsers = users.filter(u => u.role === UserRole.DRIVER);

  // Add more driver users if needed
  const newDriverUsers: User[] = [];
  for (let i = driverUsers.length + 1; i <= 50; i++) {
    const user = userRepository.create({
      email: `driver${i}@example.com`,
      phone: `0${930000000 + i}`,
      password_hash: passwordHash,
      full_name: `Driver ${i}`,
      avatar_url: `https://i.pravatar.cc/150?img=${90 + i}`,
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
      last_login_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
    });
    newDriverUsers.push(user);
  }

  const LICENSE_DOC_IMAGES = [
    "https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?q=80&w=800",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800",
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800",
    "https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800",
    "https://images.unsplash.com/photo-1557395703-5c5592ae708c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const generateVNPlate = (type: VehicleType): string => {
    const chars = "ABCDEFHKLMNPSTVXYZ";
    const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
    const num1 = Math.floor(Math.random() * 900) + 100;
    const num2 = Math.floor(Math.random() * 90) + 10;

    if (type === VehicleType.CAR) {
      return `51${randomChar}-${num1}.${num2}`;
    } else {
      return `59-${randomChar}${Math.floor(Math.random() * 9) + 1} ${num1}.${num2}`;
    }
  };

  const savedNewDrivers = await userRepository.save(newDriverUsers);
  driverUsers.push(...savedNewDrivers);

  const vehicleTypes = [VehicleType.MOTORCYCLE, VehicleType.BICYCLE, VehicleType.CAR];

  for (let i = 0; i < 50; i++) {
    const randomVehicleType = Math.random() > 0.8 ? VehicleType.CAR : VehicleType.MOTORCYCLE;

    const driver = driverRepository.create({
      user_id: driverUsers[i].id,
      vehicle_type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      vehicle_plate: generateVNPlate(randomVehicleType),
      license_number: `DL${1000000 + i}`,
      license_image_url: LICENSE_DOC_IMAGES[i % LICENSE_DOC_IMAGES.length],
      average_rating: Number((3.5 + Math.random() * 1.5)),
      total_deliveries: Math.floor(Math.random() * 500) + 50,
      is_online: Math.random() > 0.5,
      is_verified: Math.random() > 0.1,
      status: Math.random() > 0.1 ? DriverStatus.APPROVED : DriverStatus.PENDING,
    });
    drivers.push(driver);
  }

  await driverRepository.save(drivers);
  console.log(`✓ Seeded ${drivers.length} drivers`);

  // ===============================
  // SEED USER ADDRESSES (100)
  // ===============================
  console.log('Seeding user addresses...');
  const userAddresses: UserAddress[] = [];
  const customers = users.filter(u => u.role === UserRole.CUSTOMER);

  const addressLabels = ['Home', 'Work', 'School', 'Gym', 'Friend\'s House'];
  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8'];
  const districts = ['District 1', 'District 2', 'District 3', 'District 5', 'District 7', 'District 10', 'Binh Thanh', 'Phu Nhuan'];
  const cities = ['Ho Chi Minh City'];

  for (let i = 0; i < 100; i++) {
    const customer = customers[i % customers.length];
    const baseLatitude = 10.762622;
    const baseLongitude = 106.660172;
    const hasDeliveryNote = Math.random() > 0.5;

    const address = userAddressRepository.create({
      user_id: customer.id,
      label: addressLabels[Math.floor(Math.random() * addressLabels.length)],
      address_line: `${Math.floor(Math.random() * 500) + 1} ${['Nguyen Hue', 'Le Loi', 'Tran Hung Dao', 'Pasteur', 'Vo Thi Sau'][Math.floor(Math.random() * 5)]} Street`,
      ward: wards[Math.floor(Math.random() * wards.length)],
      district: districts[Math.floor(Math.random() * districts.length)],
      city: cities[0],
      latitude: baseLatitude + (Math.random() - 0.5) * 0.1,
      longitude: baseLongitude + (Math.random() - 0.5) * 0.1,
      ...(hasDeliveryNote && { delivery_note: `Please call when you arrive. ${['Building A', 'Floor 5', 'Ring doorbell'][Math.floor(Math.random() * 3)]}` }),
      is_default: i % 2 === 0,
    });
    userAddresses.push(address);
  }

  await userAddressRepository.save(userAddresses);
  console.log(`✓ Seeded ${userAddresses.length} user addresses`);

  // ===============================
  // SEED VOUCHERS (50)
  // ===============================
  console.log('Seeding vouchers...');
  const vouchers: Voucher[] = [];
  const voucherPrefixes = ['SAVE', 'DISC', 'DEAL', 'OFFER', 'PROMO'];

  for (let i = 0; i < 50; i++) {
    const isRestaurantSpecific = Math.random() > 0.5;
    const discountType = [DiscountType.PERCENTAGE, DiscountType.FIXED_AMOUNT, DiscountType.FREE_DELIVERY][Math.floor(Math.random() * 3)];
    const hasMaxDiscount = discountType === DiscountType.PERCENTAGE;

    const voucher = voucherRepository.create({
      code: `${voucherPrefixes[i % voucherPrefixes.length]}${1000 + i}`,
      name: `${voucherPrefixes[i % voucherPrefixes.length]} Deal ${i + 1}`,
      description: `Get amazing discounts on your order!`,
      discount_type: discountType,
      discount_value: discountType === DiscountType.PERCENTAGE ? Math.floor(Math.random() * 30) + 10 : (Math.floor(Math.random() * 50) + 10) * 1000,
      ...(hasMaxDiscount && { max_discount: (Math.floor(Math.random() * 50) + 20) * 1000 }),
      min_order_amount: (Math.floor(Math.random() * 10) + 5) * 10000,
      usage_limit: Math.floor(Math.random() * 500) + 100,
      usage_count: Math.floor(Math.random() * 50),
      per_user_limit: Math.floor(Math.random() * 3) + 1,
      valid_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      valid_until: new Date(Date.now() + (Math.floor(Math.random() * 60) + 30) * 24 * 60 * 60 * 1000),
      ...(isRestaurantSpecific && { restaurant_id: restaurants[i % restaurants.length].id }),
      is_active: Math.random() > 0.2,
    });
    vouchers.push(voucher);
  }

  await voucherRepository.save(vouchers);
  console.log(`✓ Seeded ${vouchers.length} vouchers`);

  // ===============================
  // SEED WALLETS (60 for customers + drivers)
  // ===============================
  console.log('Seeding wallets...');
  const wallets: Wallet[] = [];
  const walletUsers = [...customers.slice(0, 50), ...driverUsers.slice(0, 10)];

  for (const user of walletUsers) {
    const wallet = walletRepository.create({
      user_id: user.id,
      balance: Math.floor(Math.random() * 1000000) + 100000,
      currency: 'VND',
      is_active: true,
    });
    wallets.push(wallet);
  }

  await walletRepository.save(wallets);
  console.log(`✓ Seeded ${wallets.length} wallets`);

  // ===============================
  // SEED WALLET TRANSACTIONS (200)
  // ===============================
  console.log('Seeding wallet transactions...');
  const walletTransactions: WalletTransaction[] = [];

  for (const wallet of wallets) {
    const numTransactions = Math.floor(Math.random() * 5) + 2;
    let currentBalance = Math.floor(Math.random() * 500000);

    for (let i = 0; i < numTransactions; i++) {
      const transactionTypes = [WalletTransactionType.TOP_UP, WalletTransactionType.PAYMENT, WalletTransactionType.REFUND, WalletTransactionType.CASHBACK];
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const amount = Math.floor(Math.random() * 200000) + 10000;
      const balanceBefore = currentBalance;

      currentBalance = type === WalletTransactionType.PAYMENT
        ? Math.max(0, currentBalance - amount)  // Ensure balance doesn't go negative
        : currentBalance + amount;

      const transaction = walletTransactionRepository.create({
        wallet_id: wallet.id,
        type,
        amount,
        balance_before: balanceBefore,
        balance_after: currentBalance,
        reference_type: type === WalletTransactionType.PAYMENT ? 'ORDER' : type === WalletTransactionType.REFUND ? 'REFUND' : 'TOP_UP',
        reference_id: `REF${Math.floor(Math.random() * 1000000)}-${i}`,
        description: `${type} transaction`,
      });
      walletTransactions.push(transaction);
    }
  }

  await walletTransactionRepository.save(walletTransactions);
  console.log(`✓ Seeded ${walletTransactions.length} wallet transactions`);

  // ===============================
  // SEED CARTS (50)
  // ===============================
  console.log('Seeding carts...');
  const carts: Cart[] = [];

  for (let i = 0; i < 50; i++) {
    const customer = customers[i % customers.length];
    const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];

    const cart = cartRepository.create({
      user_id: customer.id,
      restaurant_id: restaurant.id,
      subtotal: 0,
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });
    carts.push(cart);
  }

  await cartRepository.save(carts);
  console.log(`✓ Seeded ${carts.length} carts`);

  // ===============================
  // SEED CART ITEMS (150)
  // ===============================
  console.log('Seeding cart items...');
  const cartItems: CartItem[] = [];

  for (const cart of carts) {
    const restaurantItems = menuItems.filter(item => item.restaurant_id === cart.restaurant_id);
    const numItems = Math.floor(Math.random() * 4) + 1;
    let cartSubtotal = 0;

    for (let i = 0; i < numItems; i++) {
      const menuItem = restaurantItems[Math.floor(Math.random() * restaurantItems.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const hasSpecialInstructions = Math.random() > 0.7;

      const cartItem = cartItemRepository.create({
        cart_id: cart.id,
        menu_item_id: menuItem.id,
        quantity,
        unit_price: Number(menuItem.price),
        selected_options: { size: 'Medium', spice: 'Mild' },
        ...(hasSpecialInstructions && { special_instructions: 'No onions please' }),
      });
      cartItems.push(cartItem);
      cartSubtotal += Number(menuItem.price) * quantity;
    }

    // Update cart subtotal
    cart.subtotal = Number(cartSubtotal);
  }

  await cartItemRepository.save(cartItems);
  await cartRepository.save(carts); // Update carts with correct subtotals
  console.log(`✓ Seeded ${cartItems.length} cart items`);

  // ===============================
  // SEED ORDERS (100)
  // ===============================
  console.log('Seeding orders...');
  const orders: Order[] = [];
  const orderStatuses = Object.values(OrderStatus);
  const paymentMethods = Object.values(PaymentMethod);

  for (let i = 0; i < 100; i++) {
    const customer = customers[i % customers.length];
    const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
    const userAddress = userAddresses.find(addr => addr.user_id === customer.id) || userAddresses[0];
    const subtotal = (Math.floor(Math.random() * 200) + 50) * 1000;
    const deliveryFee = Number(restaurant.delivery_fee);
    const discountAmount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) * 1000 : 0;
    const hasVoucher = Math.random() > 0.7;
    const hasSpecialInstructions = Math.random() > 0.7;
    const hasActualDelivery = Math.random() > 0.5;

    const order = orderRepository.create({
      order_number: `ORD${Math.floor(Math.random() * 1000000)}-${i}`,
      user_id: customer.id,
      restaurant_id: restaurant.id,
      delivery_address_id: userAddress.id,
      status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      subtotal: Number(subtotal),
      delivery_fee: Number(deliveryFee),
      discount_amount: Number(discountAmount),
      total_amount: Number((subtotal + deliveryFee - discountAmount)),
      ...(hasVoucher && { voucher_id: vouchers[Math.floor(Math.random() * vouchers.length)].id }),
      payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      ...(hasSpecialInstructions && { special_instructions: 'Please ring the doorbell' }),
      estimated_delivery: new Date(Date.now() + (Math.floor(Math.random() * 30) + 20) * 60 * 1000),
      ...(hasActualDelivery && { actual_delivery: new Date(Date.now() + (Math.floor(Math.random() * 40) + 15) * 60 * 1000) }),
    });
    orders.push(order);
  }

  await orderRepository.save(orders);
  console.log(`✓ Seeded ${orders.length} orders`);

  // ===============================
  // SEED ORDER ITEMS (250)
  // ===============================
  console.log('Seeding order items...');
  const orderItems: OrderItem[] = [];

  for (const order of orders) {
    const restaurantItems = menuItems.filter(item => item.restaurant_id === order.restaurant_id);
    const numItems = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < numItems; i++) {
      const menuItem = restaurantItems[Math.floor(Math.random() * restaurantItems.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const unitPrice = Number(menuItem.price);
      const hasSpecialInstructions = Math.random() > 0.8;

      const orderItem = orderItemRepository.create({
        order_id: order.id,
        menu_item_id: menuItem.id,
        item_name: menuItem.name,
        quantity,
        unit_price: Number(unitPrice),
        total_price: Number((unitPrice * quantity)),
        selected_options: { size: 'Medium', extras: ['Extra Cheese'] },
        ...(hasSpecialInstructions && { special_instructions: 'Extra spicy' }),
      });
      orderItems.push(orderItem);
    }
  }

  await orderItemRepository.save(orderItems);
  console.log(`✓ Seeded ${orderItems.length} order items`);

  // ===============================
  // SEED DELIVERIES (70)
  // ===============================
  console.log('Seeding deliveries...');
  const deliveries: Delivery[] = [];
  const deliveryStatuses = Object.values(DeliveryStatus);
  const deliverableOrders = orders.filter(o =>
    [OrderStatus.READY_FOR_PICKUP, OrderStatus.PICKED_UP, OrderStatus.ON_THE_WAY, OrderStatus.DELIVERED].includes(o.status)
  ).slice(0, 70);

  for (let i = 0; i < deliverableOrders.length; i++) {
    const order = deliverableOrders[i];
    const driver = drivers[i % drivers.length];
    const restaurant = restaurants.find(r => r.id === order.restaurant_id);
    const deliveryAddress = userAddresses.find(addr => addr.id === order.delivery_address_id);

    if (!restaurant || !deliveryAddress) continue;

    const hasPickedUpAt = Math.random() > 0.3;
    const hasDeliveredAt = Math.random() > 0.5;
    const hasDeliveryProof = Math.random() > 0.7;

    const delivery = deliveryRepository.create({
      order_id: order.id,
      driver_id: driver.id,
      status: deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)],
      pickup_latitude: restaurant.latitude,
      pickup_longitude: restaurant.longitude,
      dropoff_latitude: deliveryAddress.latitude,
      dropoff_longitude: deliveryAddress.longitude,
      distance_km: Number((Math.random() * 10 + 1)),
      estimated_duration: Math.floor(Math.random() * 30) + 15,
      assigned_at: new Date(Date.now() - (Math.floor(Math.random() * 60) + 30) * 60 * 1000),
      ...(hasPickedUpAt && { picked_up_at: new Date(Date.now() - (Math.floor(Math.random() * 30) + 10) * 60 * 1000) }),
      ...(hasDeliveredAt && { delivered_at: new Date(Date.now() - Math.floor(Math.random() * 10) * 60 * 1000) }),
      ...(hasDeliveryProof && { delivery_proof_url: `https://picsum.photos/seed/delivery${i}/800/600` }),
    });
    deliveries.push(delivery);
  }

  await deliveryRepository.save(deliveries);
  console.log(`✓ Seeded ${deliveries.length} deliveries`);

  // ===============================
  // SEED PAYMENTS (100)
  // ===============================
  console.log('Seeding payments...');
  const payments: Payment[] = [];
  const paymentStatuses = Object.values(PaymentStatus);

  for (const order of orders) {
    const hasPaidAt = Math.random() > 0.2;
    const hasRefund = Math.random() > 0.9;
    const hasRefundedAt = Math.random() > 0.95;

    const payment = paymentRepository.create({
      order_id: order.id,
      user_id: order.user_id,
      amount: Number(order.total_amount),
      method: order.payment_method,
      status: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      transaction_id: `TXN${Math.floor(Math.random() * 1000000)}-${Math.random().toString(36).substring(7)}`,
      gateway_response: { status: 'success', message: 'Payment processed' },
      ...(hasPaidAt && { paid_at: new Date() }),
      ...(hasRefund && { refund_amount: Number(order.total_amount) }),
      ...(hasRefundedAt && { refunded_at: new Date() }),
    });
    payments.push(payment);
  }

  await paymentRepository.save(payments);
  console.log(`✓ Seeded ${payments.length} payments`);

  // ===============================
  // SEED REVIEWS (60)
  // ===============================
  console.log('Seeding reviews...');
  const reviews: Review[] = [];
  const deliveredOrders = orders.filter(o => o.status === OrderStatus.DELIVERED).slice(0, 60);

  for (const order of deliveredOrders) {
    const delivery = deliveries.find(d => d.order_id === order.id);
    const hasComment = Math.random() > 0.3;
    const hasRestaurantReply = Math.random() > 0.6;

    const review = reviewRepository.create({
      order_id: order.id,
      user_id: order.user_id,
      restaurant_id: order.restaurant_id,
      ...(delivery && { driver_id: delivery.driver_id }),
      food_rating: Math.floor(Math.random() * 2) + 4,
      ...(delivery && { delivery_rating: Math.floor(Math.random() * 2) + 4 }),
      ...(hasComment && {
        comment: [
          'Great food and service!',
          'Delicious! Will order again.',
          'Fast delivery, hot food.',
          'Amazing taste, generous portions.',
          'Good value for money.',
        ][Math.floor(Math.random() * 5)]
      }),
      is_anonymous: Math.random() > 0.8,
      ...(hasRestaurantReply && { restaurant_reply: 'Thank you for your review!' }),
      ...(hasRestaurantReply && { restaurant_replied_at: new Date() }),
    });
    reviews.push(review);
  }

  await reviewRepository.save(reviews);
  console.log(`✓ Seeded ${reviews.length} reviews`);

  // ===============================
  // SEED REVIEW IMAGES (100)
  // ===============================
  console.log('Seeding review images...');
  const reviewImages: ReviewImage[] = [];

  const REALISTIC_REVIEW_PHOTOS = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800",
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800",
    "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800",
    "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=800",
  ];

  for (const review of reviews) {
    const numImages = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numImages; i++) {
      const photoIndex = (reviewImages.length + i) % REALISTIC_REVIEW_PHOTOS.length;

      const reviewImage = reviewImageRepository.create({
        review_id: review.id,
        image_url: REALISTIC_REVIEW_PHOTOS[photoIndex],
        display_order: i,
      });
      reviewImages.push(reviewImage);
    }
  }

  await reviewImageRepository.save(reviewImages);
  console.log(`✓ Seeded ${reviewImages.length} review images`);

  // ===============================
  // SEED USER FAVORITES (100)
  // ===============================
  console.log('Seeding user favorites...');
  const userFavorites: UserFavorite[] = [];
  const favoritesPairs = new Set<string>(); // Track unique user-restaurant pairs

  while (userFavorites.length < 100) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
    const pairKey = `${customer.id}-${restaurant.id}`;

    // Skip if this pair already exists
    if (favoritesPairs.has(pairKey)) {
      continue;
    }

    favoritesPairs.add(pairKey);
    const favorite = userFavoriteRepository.create({
      user_id: customer.id,
      restaurant_id: restaurant.id,
    });
    userFavorites.push(favorite);
  }

  await userFavoriteRepository.save(userFavorites);
  console.log(`✓ Seeded ${userFavorites.length} user favorites`);

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Users: ${users.length}`);
  console.log(`   Restaurant Categories: ${restaurantCategories.length}`);
  console.log(`   Restaurants: ${restaurants.length}`);
  console.log(`   Menu Categories: ${menuCategories.length}`);
  console.log(`   Menu Items: ${menuItems.length}`);
  console.log(`   Menu Item Options: ${menuItemOptions.length}`);
  console.log(`   Operating Hours: ${operatingHours.length}`);
  console.log(`   Drivers: ${drivers.length}`);
  console.log(`   User Addresses: ${userAddresses.length}`);
  console.log(`   Vouchers: ${vouchers.length}`);
  console.log(`   Wallets: ${wallets.length}`);
  console.log(`   Wallet Transactions: ${walletTransactions.length}`);
  console.log(`   Carts: ${carts.length}`);
  console.log(`   Cart Items: ${cartItems.length}`);
  console.log(`   Orders: ${orders.length}`);
  console.log(`   Order Items: ${orderItems.length}`);
  console.log(`   Deliveries: ${deliveries.length}`);
  console.log(`   Payments: ${payments.length}`);
  console.log(`   Reviews: ${reviews.length}`);
  console.log(`   Review Images: ${reviewImages.length}`);
  console.log(`   User Favorites: ${userFavorites.length}`);
}
