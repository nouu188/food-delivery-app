import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDevice } from '@backend/database';
import { FirebaseService } from './firebase.service';
import { initializeFirebase } from './firebase.config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserDevice]),
  ],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule implements OnModuleInit {
  private readonly logger = new Logger(FirebaseModule.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.logger.log('Initializing Firebase Module...');

    const firebaseApp = initializeFirebase(this.configService);

    if (firebaseApp) {
      this.logger.log('Firebase Module initialized successfully');
    } else {
      this.logger.warn('Firebase Module initialization skipped or failed - FCM will not be available');
    }
  }
}
