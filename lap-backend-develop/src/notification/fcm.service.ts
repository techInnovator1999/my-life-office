import { AllConfigType } from '@/config/config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as serverKey from './fcmtoken.json';

@Injectable()
export class FcmService {
  fcm;

  constructor(private configService: ConfigService<AllConfigType>) {}

  getFcmInstance() {
    if (this.fcm == null) {
      this.fcm = admin.initializeApp({
        credential: admin.credential.cert(serverKey as ServiceAccount),
      });
    }
    return this.fcm;
  }
  async SendNotification(fcmToken, title, body, data = {}, imageUrl?: string) {
    return new Promise((resolve, reject) => {
      const message: any = {
        token: fcmToken,

        data: {
          sound: 'default',
          icon: this.configService.getOrThrow('notification.notificationLogo', {
            infer: true,
          }),
          color: '#6246EA',
          imageUrl: imageUrl ?? '',
          ...data,
        },
      };

      const notification: any = {
        title,
        body,
      };
      message.notification = notification;

      const dryRun = false;
      this.getFcmInstance()
        .messaging()
        .send(message, dryRun)
        .then((response) => {
          console.log('Successfully sent message:', response);
          return resolve(response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
          return reject(error);
        });
    });
  }
}
