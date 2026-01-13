// src/brokers/domain/broker.ts

import { Carrier } from '@/carriers/domain/carrier';
import { BrokerStaff } from './broker_staff';
import { BrokerTypeEnum } from '../brokers.enum';

export class Broker {
  id: string;
  name: string;
  brokerType: BrokerTypeEnum;
  website: string | null;
  address: string | null;
  contracting: string | null;
  mainContact: string | null;
  phoneNumber: string | null;
  notes: string | null;

  carriers?: Carrier[];
  brokerStaff?: BrokerStaff[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
