import { NestFactory } from '@nestjs/core';
import { PlanSeedService } from './plan/plan-seed.service';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { FileSeedService } from './file/file-seed.service';
import { CarrierSeedService } from './carrier/carrier-seed.service';
import { CarrierSeedRow } from './carrier/carrier-seed-row.interface';
import { BrokerSeedService } from './broker/broker-seed.service';
import { ServiceMainSeedService } from './serviceMain/service-main-seed.service';
import { PaycodeSeedService } from './paycode/paycode-seed.service';
import { DepositTypeSeedService } from './deposit-type/deposit-type-seed.service';
import { ProductSeedService } from './product/product-seed.service';
import { CompanySeedService } from './company/company-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();

  await app.get(PlanSeedService).run();

  // Seed From file
  const fileSeedData = app.get(FileSeedService).readJsonFile();
  if (!fileSeedData) {
    console.log('No seed data found. Skipping seed.');
    return;
  }

  const { Companies, Brokers, Services } = fileSeedData;
  let brokerAllianceId;
  if (Brokers?.length) {
    const savedBrokers = await app
      .get(BrokerSeedService)
      .getOrCreateMultiple(fileSeedData.Brokers);
    const brokerAlliance = savedBrokers.find(
      (b) => b.name === 'Brokers Alliance',
    );
    brokerAllianceId = brokerAlliance.id;
  }

  let lifeInsuranceServiceId;
  if (Services?.length) {
    const savedServices = await app
      .get(ServiceMainSeedService)
      .getOrCreateMultiple(fileSeedData.Services);
    const liService = savedServices.find((s) => s.name === 'Life Insurance');
    lifeInsuranceServiceId = liService.id;
  }

  if (Companies?.length) {
    await app.get(CompanySeedService).run(Companies);
  }

  const fileSeedService = app.get(FileSeedService);
  const sheetData = fileSeedService.readCsvFile();

  if (sheetData.length === 0) {
    console.log('No seed data found. Skipping seed.');
    return;
  }
  const seedData = sheetData[0].rows as CarrierSeedRow[];
  const carrierSeedService = app.get(CarrierSeedService);

  if (brokerAllianceId && lifeInsuranceServiceId) {
    await carrierSeedService.seedFromRows(
      seedData,
      lifeInsuranceServiceId,
      brokerAllianceId,
    );

    console.log(`Processed ${seedData.length} carriers.`);

    // create paycodes
    await app.get(PaycodeSeedService).createMany(seedData);

    // create deposit type
    const depositType = await app
      .get(DepositTypeSeedService)
      .run(lifeInsuranceServiceId);

    await app
      .get(ProductSeedService)
      .seedFromRows(sheetData, depositType, lifeInsuranceServiceId);
  }

  console.log('Seeding completed');

  await app.close();
};

void runSeed();
