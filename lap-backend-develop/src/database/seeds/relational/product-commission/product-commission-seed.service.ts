import { PaycodeEntity } from '@/paycodes/infrastructure/persistence/relational/entities/paycode.entity';
import { ProductCommissionEntity } from '@/product-commissions/infrastructure/persistence/relational/entities/product-commission.entity';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductSeedRow } from '../product/product-seed-row.interface';

@Injectable()
export class ProductCommissionSeedService {
  constructor(
    @InjectRepository(ProductCommissionEntity)
    private readonly productCommissionRepo: Repository<ProductCommissionEntity>,
    @InjectRepository(PaycodeEntity)
    private readonly paycodeRepo: Repository<PaycodeEntity>,
  ) {}

  async seedForProduct(
    product: ProductEntity,
    row: ProductSeedRow,
    carrierId: string,
  ): Promise<void> {
    const paycodeValues = row['All Vendor paycodes'];
    if (paycodeValues === undefined) {
      console.log(`⚠️ No paycodes found for product: ${product.name}`);
      return;
    }
    const paycodeKeys = paycodeValues.split(',').map((p) => p.trim());

    const commissionsToSave: ProductCommissionEntity[] = [];

    const paycodes = await this.paycodeRepo.find({
      where: {
        carrier: { id: carrierId },
        name: In(paycodeKeys),
      },
    });

    if (!paycodes || paycodes.length == 0) {
      console.log(`⚠️ No paycodes found for product: ${product.name}`);
      return;
    }
    for (const paycodeName of paycodeKeys) {
      const commissionValue = row[paycodeName] ?? 0;

      const paycode = paycodes.find((p) => p.name === paycodeName);
      if (!paycode) {
        console.log(`⚠️ No paycode found for name: ${paycodeName}`);
        continue;
      }

      const commission = new ProductCommissionEntity();
      commission.product = product;
      commission.paycode = paycode;
      commission.commission = parseFloat(commissionValue as string);

      commissionsToSave.push(commission);
    }

    if (commissionsToSave.length > 0) {
      await this.productCommissionRepo.save(commissionsToSave);
    }
  }
}
