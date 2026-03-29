import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from './services/services.module';
import { SlotsModule } from './slots/slots.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'mysql'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USER', 'barber'),
        password: config.get<string>('DB_PASSWORD', 'barber_password'),
        database: config.get<string>('DB_NAME', 'barber_booking'),
        charset: 'utf8mb4',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ServicesModule,
    SlotsModule,
    BookingsModule,
  ],
})
export class AppModule {}
