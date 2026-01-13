import { Injectable } from '@nestjs/common';
import { ProductCommissionGridRepository } from './infrastructure/persistence/product-commissions-grid.repository';
import { ProductCommissionResponseDto } from './dto/product-commission-grid-response.dto';
import { PaycodeType } from '@/paycodes/paycodes.enum';

@Injectable()
export class ProductCommissionsGridService {
  constructor(
    private readonly productCommissionGridRepository: ProductCommissionGridRepository,
  ) {}
  /**
   * Retrieves product commissions by carrier ID.
   * @param carrierId - The ID of the carrier for which to retrieve commissions.
   * @returns A promise that resolves to the product commissions data.
   */
  async getCommissionsByCarrierId(
    carrierId: string,
    page: number,
    limit: number,
  ): Promise<{ data: ProductCommissionResponseDto[]; total: number }> {
    const { entities: rawProducts, total } =
      await this.productCommissionGridRepository.getProductCommissionsByCarrier(
        carrierId,
        page,
        limit,
      );

    return {
      data: rawProducts.map((product) => ({
        productId: product.id,
        productName: product.productFullName ?? product.name,
        carrierId: product.carrier?.id ?? carrierId,
        commissions: product.productCommissions
          .filter((pc) => pc.paycode?.type !== PaycodeType.LOA)
          .map((pc) => ({
            paycodeId: pc.paycode?.id ?? '',
            paycodeName: pc.paycode?.name ?? 'Unknown',
            productCommissionId: pc.id,
            commission: pc.commission,
          })),
      })),
      total,
    };
  }
}
