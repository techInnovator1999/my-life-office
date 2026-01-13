// src/brokers/domain/broker-staff.ts

import { Broker } from './broker';

export class BrokerStaff {
  id: string;
  name: string;
  phone: string;
  title: string;
  email: string;

  broker: Broker;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
