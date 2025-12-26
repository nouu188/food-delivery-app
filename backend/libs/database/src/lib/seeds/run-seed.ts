import 'dotenv/config';
import { DataSource } from 'typeorm';
import { seedDatabase } from './data-seed';
import * as AllEntities from '../entities';

const configService = {
  get(key: string, defaultValue?: any) {
    const value = process.env[key];

    return value !== undefined ? value : defaultValue;
  },
};

const entities = Object.values(AllEntities);

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST', 'localhost'),
  port: Number(configService.get('POSTGRES_PORT', '5432')),
  username: configService.get('POSTGRES_USER', 'postgres'),
  password: configService.get('POSTGRES_PASSWORD', 'postgres'),
  database: configService.get('POSTGRES_NAME', 'food_delivery'),
  entities: entities,
  synchronize: true,
  logging: true,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: false,
  ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
});

async function runSeed() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    console.log('Database connected successfully!\n');

    await seedDatabase(AppDataSource);

    console.log('\nSeeding process completed!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

runSeed();