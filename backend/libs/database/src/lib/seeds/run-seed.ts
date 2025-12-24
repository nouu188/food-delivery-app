import { DataSource } from 'typeorm';
import { seedDatabase } from './data-seed';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: Number(process.env['DB_PORT'] ?? 5432),
  username: process.env['DB_USERNAME'] ?? 'postgres',
  password: process.env['DB_PASSWORD'] ?? 'postgres',
  database: process.env['DB_NAME'] ?? 'food_delivery',
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
});

async function runSeed() {
  try {
    console.log('🔌 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully!\n');

    await seedDatabase(AppDataSource);

    console.log('\n🎉 Seeding process completed!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

runSeed();
