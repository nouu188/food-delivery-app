import { DatabaseModule } from '@backend/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { FirebaseModule } from './firebase/firebase.module';
import { FcmListener } from './listeners/fcm.listener';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    FirebaseModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, FcmListener],
})
export class AppModule {}
