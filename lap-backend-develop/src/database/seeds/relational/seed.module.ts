import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/database/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../../typeorm-config.service';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import { PlanSeedModule } from './plan/plan-seed.module';
import userConfig from '@/users/config/user.config';
import { ServiceMainSeedModule } from './serviceMain/service-main-seed.module';
import { BrokerSeedModule } from './broker/broker-seed.module';
import { FileSeedModule } from './file/file-seed.module';
import { CarrierSeedModule } from './carrier/carrier-seed.module';
import { PaycodeSeedModule } from './paycode/paycode-seed.module';
import { ProductSeedModule } from './product/product-seed.module';
import { DepositTypeSeedModule } from './deposit-type/deposit-type-seed.module';
import { ProductCommissionSeedModule } from './product-commission/product-commission-seed.module';
import { CompanySeedModule } from './company/company-seed.module';
import { MasterPaycodeSeedModule } from './master-paycode/master-paycode-seed.module';

@Module({
  imports: [
    PlanSeedModule,
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    ServiceMainSeedModule,
    BrokerSeedModule,
    MasterPaycodeSeedModule,
    FileSeedModule,
    CarrierSeedModule,
    PaycodeSeedModule,
    ProductSeedModule,
    DepositTypeSeedModule,
    ProductCommissionSeedModule,
    CompanySeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, userConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
