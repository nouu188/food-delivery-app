import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as AllEntities from './entities';

const entities = Object.values(AllEntities);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', configService.get('DB_HOST', 'localhost')),
        port: configService.get('DATABASE_PORT', configService.get('DB_PORT', 5436)),
        username: configService.get('DATABASE_USER', configService.get('POSTGRES_USER', 'postgres')),
        password: configService.get('DATABASE_PASSWORD', configService.get('POSTGRES_PASSWORD', 'postgres')),
        database: configService.get('DATABASE_NAME', configService.get('DB_NAME', 'food_delivery')),
        entities: entities,
        synchronize: true,
        logging: true,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: false,
        ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
