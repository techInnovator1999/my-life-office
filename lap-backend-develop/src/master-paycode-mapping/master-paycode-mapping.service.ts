import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignMasterPaycodesDto } from './dto/assign-master-paycodes.dto';
import { MasterPaycodeMapping } from './domain/master-paycode-mapping';
import { MasterPaycodeMappingRepository } from './infrastructure/persistence/master-paycode-mapping.repository';
import { ProductCommissionsService } from '@/product-commissions/product-commissions.service';
import { PaycodesService } from '@/paycodes/paycodes.service';
import { MasterPaycodeService } from '@/master-paycode/master-paycode.service';
import { PaycodeType } from '@/paycodes/paycodes.enum';
import { CompanyService } from '@/company/company.service';
import { UpdateMasterPaycodeMappingDto } from './dto/update-master-paycode-mapping.dto';
import { PaycodeGridResponseDto } from './dto/paycode-grid-response.dto';
import { MasterPaycodeMap } from './carrier-agent-commissions.enum';
import { plainToInstance } from 'class-transformer';
import { CompanyMasterPaycode } from '@/company/domain/company-master-paycode';

@Injectable()
export class MasterPaycodeMappingService {
  constructor(
    private readonly masterPaycodeMappingRepository: MasterPaycodeMappingRepository,
    private readonly paycodesService: PaycodesService,
    private readonly productCommissionService: ProductCommissionsService,
    private readonly masterPaycodeService: MasterPaycodeService,
    private readonly companyService: CompanyService,
  ) {}

  async create(data: AssignMasterPaycodesDto) {
    const vendorPaycodes = data.assignedCommissions ?? [];
    const loaPaycodes = data.loaCommissions ?? [];
    if (!vendorPaycodes?.length && !loaPaycodes?.length) {
      throw new BadRequestException(
        'Either assignedCommissions or loaCommissions must be provided.',
      );
    }

    const allCarrierPaycodesResponse =
      await this.paycodesService.findAllByCarrierId(data.carrierId);
    const allCarrierPaycodes = allCarrierPaycodesResponse.data;

    const result: MasterPaycodeMapping[] = [];

    for (const vendorPaycode of vendorPaycodes) {
      const masterPaycode = await this.masterPaycodeService.findOne(
        vendorPaycode.masterPaycodeId,
      );
      if (!masterPaycode) {
        throw new BadRequestException(
          `Master Level ${vendorPaycode.masterPaycodeId} not found`,
        );
      }

      const paycode = allCarrierPaycodes.find(
        (pc) => pc.id === vendorPaycode.paycodeId,
      );
      if (!paycode)
        throw new BadRequestException(
          `Paycode: ${vendorPaycode.paycodeId} not found`,
        );

      const commission = new MasterPaycodeMapping();
      commission.masterPaycode = masterPaycode;
      commission.paycode = paycode;

      const saved =
        await this.masterPaycodeMappingRepository.create(commission);
      result.push(saved);
    }

    for (const loa of loaPaycodes) {
      const masterPaycode = await this.masterPaycodeService.findOne(
        loa.masterPaycodeId,
      );
      if (!masterPaycode) {
        throw new NotFoundException(
          `Master Level ${loa.masterPaycodeId} not found`,
        );
      }

      const paycode = await this.paycodesService.create({
        name: loa.paycodeName,
        type: PaycodeType.LOA,
        carrier: { id: data.carrierId },
      });

      for (const productCommission of loa.productCommissions) {
        await this.productCommissionService.create({
          product: { id: productCommission.productId },
          commission: productCommission.commission,
          paycode: { id: paycode.id },
        });
      }

      const commission = new MasterPaycodeMapping();
      commission.masterPaycode = masterPaycode;
      commission.paycode = paycode;

      const saved =
        await this.masterPaycodeMappingRepository.create(commission);
      result.push(saved);
    }

    return result;
  }

  async getCommissionGrid(carrierId: string, companyId?: string) {
    const masterPaycodes = await this.masterPaycodeService.findAll();
    if (masterPaycodes.total === 0) {
      throw new BadRequestException('Master paycodes not found');
    }
    const paycodes =
      await this.paycodesService.findAllByCarrierIdWithCommissions(carrierId);
    const mpMapping =
      await this.masterPaycodeMappingRepository.findByCarrierId(carrierId);

    let companyMasterPaycodes: CompanyMasterPaycode[] = [];
    if (companyId) {
      companyMasterPaycodes =
        await this.companyService.getCompanyMasterPaycodes(companyId);
    }

    return masterPaycodes.data.map((mp) => {
      const cac = mpMapping.find((c) => c.masterPaycode.id === mp.id);
      const paycode = cac
        ? paycodes.find((pc) => pc.id === cac.paycode.id)
        : {
            id: null,
            type: null,
            name: null,
            productCommissions: [],
          };

      const companyMasterPaycode = companyMasterPaycodes?.find(
        (cml) => cml.masterPaycode?.id === mp.id,
      );

      const mlWithCompanyLevel = {
        ...mp,
        companyMasterPaycode: companyMasterPaycode
          ? {
              id: companyMasterPaycode.id,
              value: companyMasterPaycode.value,
            }
          : null,
      };

      return plainToInstance(
        PaycodeGridResponseDto,
        {
          id: cac ? cac.id : null,
          masterPaycode: mlWithCompanyLevel,
          paycode,
        },
        { excludeExtraneousValues: true },
      );
    });
  }

  async update(
    data: UpdateMasterPaycodeMappingDto,
  ): Promise<MasterPaycodeMapping[]> {
    const vendorPaycodes = data.assignedCommissions ?? [];
    const loaPaycodes = data.loaCommissions ?? [];
    if (!vendorPaycodes?.length && !loaPaycodes?.length) {
      throw new BadRequestException(
        'Either assignedCommissions or loaCommissions must be provided.',
      );
    }

    const { carrierId } = data;
    if (!carrierId) {
      throw new BadRequestException('carrierId is required');
    }

    const incomingPaycodeMapping: MasterPaycodeMap[] = [];
    // output result
    const result: MasterPaycodeMapping[] = [];

    // 1. Handle Vendor Paycodes
    for (const vendorPaycode of vendorPaycodes) {
      const masterPaycode = await this.masterPaycodeService.findOne(
        vendorPaycode.masterPaycodeId,
      );
      if (!masterPaycode) {
        throw new NotFoundException(
          `Master Paycode ${vendorPaycode.masterPaycodeId} not found`,
        );
      }

      const paycode = await this.paycodesService.findOneById(
        vendorPaycode.paycodeId,
      );
      if (!paycode)
        throw new NotFoundException(
          `Paycode: ${vendorPaycode.paycodeId} not found`,
        );

      const existingCommission =
        await this.masterPaycodeMappingRepository.findOne({
          where: {
            masterPaycode: { id: masterPaycode.id },
            paycode: { carrier: { id: carrierId } },
          },
          relations: ['paycode', 'paycode.carrier'],
        });

      if (existingCommission) {
        const updated = await this.masterPaycodeMappingRepository.update(
          existingCommission.id,
          { masterPaycode, paycode },
        );
        result.push(updated);
        incomingPaycodeMapping.push({
          masterPaycodeId: masterPaycode.id,
          paycodeId: paycode.id,
        });
      } else {
        const created = await this.masterPaycodeMappingRepository.create({
          masterPaycode,
          paycode,
        });
        result.push(created);
        incomingPaycodeMapping.push({
          masterPaycodeId: masterPaycode.id,
          paycodeId: paycode.id,
        });
      }
    }

    // 2. Handle LOA Paycodes
    for (const loa of loaPaycodes) {
      const masterPaycode = await this.masterPaycodeService.findOne(
        loa.masterPaycodeId,
      );
      if (!masterPaycode) {
        throw new NotFoundException(
          `Master Paycode ${loa.masterPaycodeId} not found`,
        );
      }

      // Create or reuse LOA Paycode
      const paycode = await this.paycodesService.create({
        name: loa.paycodeName,
        type: PaycodeType.LOA,
        carrier: { id: carrierId },
      });

      // Update Product Commissions under this LOA
      for (const productCommission of loa.productCommissions) {
        const existing =
          await this.productCommissionService.findByPaycodeIdAndProductId(
            paycode.id,
            productCommission.productId,
          );

        if (existing) {
          await this.productCommissionService.update(existing.id, {
            commission: productCommission.commission,
          });
        } else {
          await this.productCommissionService.create({
            product: { id: productCommission.productId },
            commission: productCommission.commission,
            paycode: { id: paycode.id },
          });
        }
      }

      const exPaycodeMapping =
        await this.masterPaycodeMappingRepository.findOneBy({
          masterPaycode: { id: masterPaycode.id },
          paycode: { id: paycode.id },
        });

      if (exPaycodeMapping) {
        const updated = await this.masterPaycodeMappingRepository.update(
          exPaycodeMapping.id,
          { masterPaycode, paycode },
        );
        result.push(updated);
        incomingPaycodeMapping.push({
          masterPaycodeId: masterPaycode.id,
          paycodeId: paycode.id,
        });
      } else {
        const created = await this.masterPaycodeMappingRepository.create({
          masterPaycode,
          paycode,
        });
        result.push(created);
        incomingPaycodeMapping.push({
          masterPaycodeId: masterPaycode.id,
          paycodeId: paycode.id,
        });
      }
    }

    const existing: MasterPaycodeMapping[] =
      await this.masterPaycodeMappingRepository.find({
        where: { paycode: { carrier: { id: carrierId } } },
        relations: ['masterPaycode', 'paycode', 'paycode.carrier'],
      });

    if (!existing.length) {
      throw new NotFoundException('Master Paycode Mappings not found');
    }
    const incomingPaycodeMappingSet = new Set(
      incomingPaycodeMapping.map((i) => `${i.masterPaycodeId}:${i.paycodeId}`),
    );
    const toDelete = existing.filter(
      (e) =>
        !incomingPaycodeMappingSet.has(`${e.masterPaycode.id}:${e.paycode.id}`),
    );

    if (toDelete.length) {
      await this.masterPaycodeMappingRepository.removeAll(
        toDelete.map((e) => ({
          masterPaycodeId: e.masterPaycode.id,
          paycodeId: e.paycode.id,
        })),
      );
    }

    return result;
  }
}
