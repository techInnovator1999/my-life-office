import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import fileConfig from './files/config/file.config';
import facebookConfig from './auth-facebook/config/facebook.config';
import googleConfig from './auth-google/config/google.config';
import twitterConfig from './auth-twitter/config/twitter.config';
import appleConfig from './auth-apple/config/apple.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAppleModule } from './auth-apple/auth-apple.module';
import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { AuthTwitterModule } from './auth-twitter/auth-twitter.module';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './mail/mail.module';
import { HomeModule } from './home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { SessionModule } from './session/session.module';
import { MailerModule } from './mailer/mailer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { DatabaseConfig } from './database/config/database-config.type';
import { APP_FILTER } from '@nestjs/core';
import { LogsFilter } from './logs/logs.filter';
import { LogsModule } from './logs/logs.module';
import { PlanModule } from './plan/plan.module';
import { StripeModule } from './stripe/stripe.module';
import stripeConfig from './stripe/config/stripe-config';
import userConfig from './users/config/user.config';
import { AccountNotificationModule } from './account_notification/account-notification.module';
import { PushNotificationModule } from './notification/push.notification.module';
import notificationConfig from './notification/config/notification.config';
import { AccountManagerModule } from './account-manager/account-manager.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailTemplateModule } from './email-template/email-template.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { QueueModule } from './queue/queue.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { CarriersModule } from './carriers/carriers.module';
import { BrokersModule } from './brokers/brokers.module';
import { DepositTypesModule } from './deposit-types/deposit-types.module';
import { ProductCommissionsModule } from './product-commissions/product-commissions.module';
import { PaycodesModule } from './paycodes/paycodes.module';
import { DepositTypeNamesModule } from './deposit-type-names/deposit-type-names.module';
import { MasterPaycodeModule } from './master-paycode/master-paycode.module';
import { ProductCommissionsGridModule } from './product-commissions-grid/product-commissions-grid.module';
import { CompanyModule } from './company/company.module';
import { MasterPaycodeMappingModule } from './master-paycode-mapping/master-paycode-mapping.module';
import { ContactsModule } from './contacts/contacts.module';
import { LicenseTypeModule } from './license-type/license-type.module';
import { RegionModule } from './region/region.module';
import { TermLicenseModule } from './term-license/term-license.module';
import { ProductSoldModule } from './product-sold/product-sold.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        notificationConfig,
        facebookConfig,
        googleConfig,
        twitterConfig,
        appleConfig,
        stripeConfig,
        userConfig,
      ],
      envFilePath: ['.env'],
    }),
    (databaseConfig() as DatabaseConfig).isDocumentDatabase
      ? MongooseModule.forRootAsync({
          useClass: MongooseConfigService,
        })
      : TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
          dataSourceFactory: async (options: DataSourceOptions) => {
            return new DataSource(options).initialize();
          },
        }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    SentryModule.forRoot(),
    CronModule,
    UsersModule,
    FilesModule,
    AuthModule,
    AuthFacebookModule,
    AuthGoogleModule,
    AuthTwitterModule,
    AuthAppleModule,
    SessionModule,
    MailModule,
    MailerModule,
    PlanModule,
    LogsModule,
    StripeModule,
    HomeModule,
    PushNotificationModule,
    AccountNotificationModule,
    AccountManagerModule,
    EmailTemplateModule,
    QueueModule,
    ProductsModule,
    ServicesModule,
    CarriersModule,
    BrokersModule,
    DepositTypesModule,
    ProductCommissionsModule,
    // CommissionLevelsModule,
    PaycodesModule,
    DepositTypeNamesModule,
    MasterPaycodeModule,
    ProductCommissionsGridModule,
    CompanyModule,
    MasterPaycodeMappingModule,
    ContactsModule,
    LicenseTypeModule,
    RegionModule,
    TermLicenseModule,
    ProductSoldModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: LogsFilter,
    },
  ],
})
export class AppModule {}
