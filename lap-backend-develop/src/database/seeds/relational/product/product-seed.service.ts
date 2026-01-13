import { Injectable } from '@nestjs/common';
import { CarrierSeedRow } from '../carrier/carrier-seed-row.interface';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CarrierSeedService } from '../carrier/carrier-seed.service';
import { SubTypeSeedService } from '../subType/subType-seed.service';
import { ProductSeedMapper } from './product-seed.mapper';
import { ProductSeedRow } from './product-seed-row.interface';
import { DepositTypeEntity } from '@/deposit-types/infrastructure/persistence/relational/entities/deposit-type.entity';
import { ProductCommissionSeedService } from '../product-commission/product-commission-seed.service';

@Injectable()
export class ProductSeedService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly carrierSeedService: CarrierSeedService,
    private readonly subTypeSeedService: SubTypeSeedService,
    private readonly commissionSeedService: ProductCommissionSeedService,
  ) {}
  async seedFromRows(
    sheetData: {
      sheetName: string;
      rows: unknown[];
    }[],
    depositType: DepositTypeEntity,
    serviceMainId: string,
  ) {
    const carriers = sheetData[0].rows as CarrierSeedRow[];

    for (const carrierData of carriers) {
      // 1. Get the carrier using the serviceId
      const carrierServiceId = carrierData['Service-Carrier ID'];
      const carrier = await this.carrierSeedService.findOneBy({
        serviceId: carrierServiceId,
      });
      if (!carrier) {
        console.log(
          `⚠️ Skipping create product (No Carrier): ${carrierServiceId}`,
        );
        continue;
      }

      // 2. Fetch the carrier sheet
      const productsToCreate = sheetData.find(
        (s) => s.sheetName === carrierServiceId,
      )?.rows;
      if (!productsToCreate) continue;

      // 4. create all products
      for (const data of productsToCreate) {
        const productData = data as ProductSeedRow;
        // 4 (a). Create subtypes from sheet dropdown
        // Note: If Sub-type field in sheet is not defined. We'll use "TBD" as default sub-service name.
        const subTypeValue = productData['Sub-type'] ?? 'TBD';

        const [subType] = await this.subTypeSeedService.getOrCreateMultiple(
          [subTypeValue],
          serviceMainId,
        );

        // 4 (b). Optionally, seed carrier data (e.g., update existing)
        // await this.carrierSeedService.seedFromRow(row);

        try {
          // 4(c). Map sheet data to ProductEntity
          const product = ProductSeedMapper.toEntity({
            row: productData as unknown as ProductSeedRow,
            carrier,
            subType: subType,
            depositType,
          });

          // 6. Save product
          const savedProduct = await this.productRepo.save(product);
          console.log(`✅ Created Product: `, savedProduct.name);

          // 7. Save commissions
          await this.commissionSeedService.seedForProduct(
            savedProduct,
            productData,
            carrier.id,
          );
        } catch (err) {
          console.log(
            `⚠️ Skipping product (Error in product creation): ${productData['Product Name Full']} for ${carrier.serviceId}}`,
            err.message,
          );
          continue;
        }
      }
    }

    return { message: 'Seeding completed' };
  }
}
