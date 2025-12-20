import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', configService.get('DB_HOST', 'localhost')),
        port: configService.get('DATABASE_PORT', configService.get('DB_PORT', 5432)),
        username: configService.get('DATABASE_USER', configService.get('POSTGRES_USER', 'postgres')),
        password: configService.get('DATABASE_PASSWORD', configService.get('POSTGRES_PASSWORD', 'postgres')),
        database: configService.get('DATABASE_NAME', configService.get('DB_NAME', 'food_delivery')),
        entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: false,
        ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
