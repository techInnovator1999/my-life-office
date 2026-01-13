import { Injectable } from '@nestjs/common';
import { CarrierRepository } from './infrastructure/persistence/carrier.repository';
import { Carrier } from './domain/carrier';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { NullableType } from '@/utils/types/nullable.type';
import { FilterCarrierDto, SortCarrierDto } from './dto/query-carrier.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { FindAllCarrierDto } from './dto/find-all-carrier.dto';
import { Paycode } from '@/paycodes/domain/paycode';
import { PaycodesService } from '@/paycodes/paycodes.service';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { ServiceMain } from '@/services/domain/service-main';
import { Broker } from '@/brokers/domain/broker';
import { CarrierMapper } from './infrastructure/persistence/relational/mappers/carrier.mapper';
import { PaycodeType } from '@/paycodes/paycodes.enum';

@Injectable()
export class CarriersService {
  constructor(
    private readonly carrierRepository: CarrierRepository,
    private readonly paycodesService: PaycodesService,
  ) {}

  async create(
    // data: Omit<Carrier, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
    data: CreateCarrierDto,
  ) {
    const carrier = this.mapDomainFromCreateDto(data);
    const newCarrier = await this.carrierRepository.create(carrier);
    if (data.paycodeName?.length) {
      newCarrier.paycodes = await this.handlePaycodes(
        data.paycodeName,
        newCarrier.id,
      );
    }

    return newCarrier;
  }

  async findAll() {
    return this.carrierRepository.findMany({});
  }

  findOne(fields: EntityCondition<Carrier>): Promise<NullableType<Carrier>> {
    return this.carrierRepository.findOne(fields);
  }

  findOneById(id: Carrier['id']): Promise<NullableType<Carrier>> {
    return this.carrierRepository.findOneById(id);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCarrierDto | null;
    // id?: string | null;
    sortOptions?: SortCarrierDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: FindAllCarrierDto[] }> {
    const { total, data } = await this.carrierRepository.findManyWithPagination(
      {
        filterOptions,
        // id,
        sortOptions,
        paginationOptions,
      },
    );

    // Convert entities to domain objects
    // const paycodes: Paycode[] = [];
    const dtos = data.map((entity) => {
      const carrier = CarrierMapper.toDomainMany(entity);
      if (carrier.paycodes) {
        carrier.paycodes = carrier.paycodes.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      }
      return carrier;
    });

    return { total, data: dtos };
  }

  async update(
    id: Carrier['id'],
    payload: Partial<Carrier>,
  ): Promise<Carrier | null> {
    const clonedPayload = { ...payload };
    // Remove any properties that are not part of the Carrier entity
    // add checks on relational properties if already exist
    return this.carrierRepository.update(id, clonedPayload);
  }

  async softDelete(id: Carrier['id']): Promise<void> {
    await this.carrierRepository.softDelete(id);
  }

  async hardDelete(id: Carrier['id']): Promise<void> {
    const carrier = await this.carrierRepository.findOneById(id);
    if (!carrier) {
      throw new Error(`Carrier with id ${id} not found`);
    }

    await this.carrierRepository.delete(id);
    // Optionally, we can add cascade delete logic for relations like broker.
  }

  findOrFail(id: Carrier['id']): Promise<Carrier> {
    return this.carrierRepository.findOrFail(id);
  }

  private async handlePaycodes(
    paycodeNames: string[],
    carrierId: string,
  ): Promise<Paycode[]> {
    const paycodes: Paycode[] = [];

    for (const name of paycodeNames) {
      let paycode = await this.paycodesService.findByNameAndCarrierId(
        name,
        carrierId,
      );
      paycode ??= await this.paycodesService.create({
        name,
        carrier: { id: carrierId },
        type: PaycodeType.VENDOR,
      });
      paycodes.push(paycode);
    }

    return paycodes;
  }

  private mapDomainFromCreateDto(data: CreateCarrierDto): Carrier {
    const carrier = new Carrier();
    Object.assign(carrier, data);

    carrier.shortName = data.shortName;
    carrier.mainAddress = data.mainAddress;

    const broker = new Broker();
    broker.id = data.brokerId;
    carrier.broker = broker;

    const serviceMain = new ServiceMain();
    serviceMain.id = data.serviceMainId;
    carrier.serviceMain = serviceMain;

    return carrier;
  }
}
