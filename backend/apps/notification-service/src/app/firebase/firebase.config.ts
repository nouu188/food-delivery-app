import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

const logger = new Logger('FirebaseConfig');

export const initializeFirebase = (configService: ConfigService): admin.app.App | null => {
  try {
    const fcmEnabled = configService.get<string>('FCM_ENABLED') === 'true';

    if (!fcmEnabled) {
      logger.warn('FCM is disabled via FCM_ENABLED environment variable');
      return null;
    }

    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      logger.log('Firebase Admin SDK already initialized');
      return admin.app();
    }

    const projectId = configService.get<string>('FIREBASE_PROJECT_ID');
    const serviceAccountPath = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');

    if (!projectId) {
      logger.error('FIREBASE_PROJECT_ID is not set in environment variables');
      return null;
    }

    let credential: admin.credential.Credential;

    // Try to load from service account file
    if (serviceAccountPath) {
      const absolutePath = path.resolve(process.cwd(), serviceAccountPath);

      if (fs.existsSync(absolutePath)) {
        logger.log(`Loading Firebase credentials from: ${serviceAccountPath}`);
        credential = admin.credential.cert(absolutePath);
      } else {
        logger.error(`Service account file not found at: ${absolutePath}`);
        logger.error('Please ensure firebase-admin-sdk.json exists at the specified path');
        return null;
      }
    } else {
      // Fallback to individual environment variables
      const clientEmail = configService.get<string>('FIREBASE_CLIENT_EMAIL');
      const privateKey = configService.get<string>('FIREBASE_PRIVATE_KEY');

      if (!clientEmail || !privateKey) {
        logger.error('Firebase credentials not found. Please set either:');
        logger.error('1. FIREBASE_SERVICE_ACCOUNT_PATH (path to service account JSON), or');
        logger.error('2. FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY');
        return null;
      }

      logger.log('Loading Firebase credentials from environment variables');
      credential = admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      });
    }

    const firebaseApp = admin.initializeApp({
      credential,
      projectId,
    });

    logger.log(`Firebase Admin SDK initialized successfully for project: ${projectId}`);

    return firebaseApp;
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK:', error.message);
    logger.error(error.stack);
    return null;
  }
};

export const getFirebaseApp = (): admin.app.App | null => {
  if (admin.apps.length === 0) {
    logger.warn('Firebase Admin SDK is not initialized');
    return null;
  }
  return admin.app();
};

export const getFirebaseMessaging = (): admin.messaging.Messaging | null => {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }
  return admin.messaging(app);
};
