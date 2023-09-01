import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({})
export class RedisModule {
  static register(name: string): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: name,
          useFactory: (configService: ConfigService) =>
            new Redis({
              host: configService.get<string>(`REDIS_HOST`),
              port: configService.get<number>(`REDIS_PORT`),
              username: configService.get<string>(`REDIS_USERNAME`),
              password: configService.get<string>(`REDIS_PASSWORD`),
              db: configService.get<number>(`REDIS_DB_${name}`),
            }),
          inject: [ConfigService],
        },
      ],
      exports: [name],
    };
  }
}
