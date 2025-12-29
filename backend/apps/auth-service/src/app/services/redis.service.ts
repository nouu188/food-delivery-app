import { Injectable, Logger, OnModuleInit, OnModuleDestroy, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);
  private isConnected = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
      const redisPort = this.configService.get<number>('REDIS_PORT', 6379);
      const redisPassword = this.configService.get<string>('REDIS_PASSWORD', '');

      this.client = createClient({
        socket: {
          host: redisHost,
          port: redisPort,
          reconnectStrategy: (retries) => {
            if (retries > this.maxReconnectAttempts) {
              this.logger.error(`Max reconnection attempts (${this.maxReconnectAttempts}) reached. Giving up.`);
              return new Error('Max reconnection attempts reached');
            }
            const delay = Math.min(retries * 100, 3000);
            this.logger.warn(`Reconnecting to Redis (attempt ${retries})... Waiting ${delay}ms`);
            return delay;
          },
        },
        password: redisPassword || undefined,
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.error('Redis Client Error:', err.message);
      });

      this.client.on('connect', () => {
        this.logger.log('Redis Client Connecting...');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.logger.log(`Redis Client Ready - Connected to ${redisHost}:${redisPort}`);
      });

      this.client.on('reconnecting', () => {
        this.reconnectAttempts++;
        this.isConnected = false;
        this.logger.warn(`Redis Client Reconnecting (attempt ${this.reconnectAttempts})...`);
      });

      this.client.on('end', () => {
        this.isConnected = false;
        this.logger.warn('Redis Client Connection Ended');
      });

      await this.client.connect();
    } catch (error) {
      this.isConnected = false;
      this.logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    try {
      if (this.client && this.isConnected) {
        await this.client.quit();
        this.isConnected = false;
        this.logger.log('Redis Client Disconnected Gracefully');
      }
    } catch (error) {
      this.logger.error('Error disconnecting Redis client:', error);
      if (this.client) {
        await this.client.disconnect();
      }
    }
  }

  private ensureConnection(): void {
    if (!this.isConnected) {
      throw new InternalServerErrorException('Redis client is not connected');
    }
  }

  getClient(): RedisClientType {
    this.ensureConnection();
    return this.client;
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) {
        return false;
      }
      await this.client.ping();
      return true;
    } catch (error) {
      this.logger.error('Redis health check failed:', error);
      return false;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      this.ensureConnection();
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Failed to set key ${key}:`, error);
      throw new InternalServerErrorException('Failed to store data in cache');
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      this.ensureConnection();
      const result = await this.client.get(key);
      return typeof result === 'string' ? result : null;
    } catch (error) {
      this.logger.error(`Failed to get key ${key}:`, error);
      throw new InternalServerErrorException('Failed to retrieve data from cache');
    }
  }

  async del(key: string): Promise<void> {
    try {
      this.ensureConnection();
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Failed to delete key ${key}:`, error);
      throw new InternalServerErrorException('Failed to delete data from cache');
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      this.ensureConnection();
      const result = await this.client.exists(key);
      return result > 0;
    } catch (error) {
      this.logger.error(`Failed to check existence of key ${key}:`, error);
      throw new InternalServerErrorException('Failed to check data existence in cache');
    }
  }

  async incr(key: string): Promise<number> {
    try {
      this.ensureConnection();
      return await this.client.incr(key);
    } catch (error) {
      this.logger.error(`Failed to increment key ${key}:`, error);
      throw new InternalServerErrorException('Failed to increment counter in cache');
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    try {
      this.ensureConnection();
      await this.client.expire(key, seconds);
    } catch (error) {
      this.logger.error(`Failed to set expiration for key ${key}:`, error);
      throw new InternalServerErrorException('Failed to set expiration in cache');
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      this.ensureConnection();
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Failed to get TTL for key ${key}:`, error);
      throw new InternalServerErrorException('Failed to get TTL from cache');
    }
  }

  async flushAll(): Promise<void> {
    try {
      this.ensureConnection();
      await this.client.flushAll();
      this.logger.warn('Redis cache flushed');
    } catch (error) {
      this.logger.error('Failed to flush Redis cache:', error);
      throw new InternalServerErrorException('Failed to flush cache');
    }
  }
}
