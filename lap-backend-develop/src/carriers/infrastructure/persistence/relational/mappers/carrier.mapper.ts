import { CarrierEntity } from '../entities/carrier.entity';
import { Carrier } from '@/carriers/domain/carrier';
import { FindAllCarrierDto } from '@/carriers/dto/find-all-carrier.dto';
import { ProductMapper } from '@/products/infrastructure/persistence/relational/mappers/product.mapper';
import { ServiceMainMapper } from '@/services/infrastructure/persistence/relational/mappers/service-main.mapper';
import { ServiceMainEntity } from '@/services/infrastructure/persistence/relational/entities/service-main.entity';
import { PaycodeMapper } from '@/paycodes/infrastructure/persistence/relational/mappers/paycode.mapper';
import { PaycodeEntity } from '@/paycodes/infrastructure/persistence/relational/entities/paycode.entity';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { refById, refManyByIds } from '@/utils/mapping.helper';
import { BrokerEntity } from '@/brokers/infrastructure/persistence/relational/entities/broker.entity';
import { BrokerMapper } from '@/brokers/infrastructure/persistence/relational/mappers/broker.mapper';

export class CarrierMapper {
  static toDomain(entity: CarrierEntity): Carrier {
    const domain = new Carrier();

    domain.id = entity.id;

    // Flatten foreign keys
    if (entity.serviceMain) {
      domain.serviceMain = ServiceMainMapper.toDomain(entity.serviceMain);
    }
    if (entity.broker) {
      domain.broker = BrokerMapper.toDomain(entity.broker);
    }
    domain.paycodes =
      entity.paycodes?.map((pc) => PaycodeMapper.toDomain(pc)) ?? [];
    domain.products =
      entity.products?.map((p) => ProductMapper.toDomain(p)) ?? [];

    domain.city = entity.city;
    domain.state = entity.state;
    domain.zip = entity.zip;

    domain.fullName = entity.fullName;
    domain.shortName = entity.shortName;
    domain.initial = entity.initial;
    domain.logo = entity.logo;

    domain.mainAddress = entity.mainAddress;
    domain.mainPhone = entity.mainPhone;
    domain.agentSupportPhone = entity.agentSupportPhone;
    domain.contactNotes = entity.contactNotes ?? null;

    domain.publicUrl = entity.publicUrl;
    domain.agentUrl = entity.agentUrl;

    domain.emailCommission = entity.emailCommission;
    domain.emailNewBusiness = entity.emailNewBusiness;

    domain.adminCutoff = entity.adminCutoff;
    domain.adminReleaseDate = entity.adminReleaseDate;
    domain.adminMinck = entity.adminMinck;
    domain.adminMineft = entity.adminMineft;
    domain.adminCommissionPolicy = entity.adminCommissionPolicy;
    domain.adminChargebackSchedule = entity.adminChargebackSchedule;
    domain.adminAdvanceCap = entity.adminAdvanceCap;
    domain.adminCommContact = entity.adminCommContact;
    domain.adminOtherNotes = entity.adminOtherNotes;

    domain.level = entity.level;
    domain.rating = entity.rating;

    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;
    return domain;
  }

  static toDomainMany(entity: CarrierEntity): FindAllCarrierDto {
    const domain = new FindAllCarrierDto();

    domain.id = entity.id;
    domain.fullName = entity.fullName;
    domain.shortName = entity.shortName;
    domain.initial = entity.initial;
    domain.logo = entity.logo;

    domain.mainAddress = entity.mainAddress;
    domain.mainPhone = entity.mainPhone;
    domain.agentSupportPhone = entity.agentSupportPhone;
    domain.contactNotes = entity.contactNotes;

    domain.publicUrl = entity.publicUrl;
    domain.agentUrl = entity.agentUrl;

    domain.emailCommission = entity.emailCommission;
    domain.emailNewBusiness = entity.emailNewBusiness;

    domain.adminCutoff = entity.adminCutoff;
    domain.adminReleaseDate = entity.adminReleaseDate;
    domain.adminMinck = entity.adminMinck;
    domain.adminMineft = entity.adminMineft;
    domain.adminCommissionPolicy = entity.adminCommissionPolicy;
    domain.adminChargebackSchedule = entity.adminChargebackSchedule;
    domain.adminAdvanceCap = entity.adminAdvanceCap;
    domain.adminCommContact = entity.adminCommContact;
    domain.adminOtherNotes = entity.adminOtherNotes;
    domain.level = entity.level;
    domain.rating = entity.rating;

    domain.city = entity.city;
    domain.state = entity.state;
    domain.zip = entity.zip;
    domain.serviceId = entity.serviceId ?? undefined;
    domain.broker = BrokerMapper.toDomain(entity.broker);
    domain.products = entity.products?.map(ProductMapper.toDomain) ?? [];
    domain.paycodes = entity.paycodes?.map(PaycodeMapper.toDomain) ?? [];
    domain.serviceMain = ServiceMainMapper.toDomain(entity.serviceMain);

    return domain;
  }

  static toPersistence(domain: Carrier): CarrierEntity {
    const entity = new CarrierEntity();

    entity.id = domain.id;
    if (domain.paycodes?.length) {
      entity.paycodes = refManyByIds<PaycodeEntity>(
        domain.paycodes.map((paycode) => paycode.id),
      );
    }

    if (domain.products?.length) {
      entity.products = refManyByIds<ProductEntity>(
        domain.products.map((product) => product.id),
      );
    }

    if (domain.serviceMain) {
      entity.serviceMain = refById<ServiceMainEntity>(domain.serviceMain.id);
    }

    if (domain.broker) {
      entity.broker = refById<BrokerEntity>(domain.broker.id);
    }

    entity.serviceId = domain.serviceId;

    // Skipping paycodes and products (handled via relations or separately)
    entity.city = domain.city;
    entity.state = domain.state;
    entity.zip = domain.zip;

    entity.fullName = domain.fullName;
    entity.shortName = domain.shortName;
    entity.initial = domain.initial;
    entity.logo = domain.logo;

    entity.mainAddress = domain.mainAddress;
    entity.mainPhone = domain.mainPhone;
    entity.agentSupportPhone = domain.agentSupportPhone;
    entity.contactNotes = domain.contactNotes ?? null;

    entity.publicUrl = domain.publicUrl;
    entity.agentUrl = domain.agentUrl;

    entity.emailCommission = domain.emailCommission;
    entity.emailNewBusiness = domain.emailNewBusiness;

    entity.adminCutoff = domain.adminCutoff;
    entity.adminReleaseDate = domain.adminReleaseDate;
    entity.adminMinck = domain.adminMinck;
    entity.adminMineft = domain.adminMineft;
    entity.adminCommissionPolicy = domain.adminCommissionPolicy;
    entity.adminChargebackSchedule = domain.adminChargebackSchedule;
    entity.adminAdvanceCap = domain.adminAdvanceCap;
    entity.adminCommContact = domain.adminCommContact;
    entity.adminOtherNotes = domain.adminOtherNotes;

    entity.level = domain.level;
    entity.rating = domain.rating;

    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;

    return entity;
  }
}
