import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from '../entities/mail.entity';
import { EmailRepository } from '../../email.repository';

@Injectable()
export class EmailRelationalRepository implements EmailRepository {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<EmailRepository>,
  ) {}

  async create(data: Partial<Email>): Promise<Email> {
    const email = new Email(data);
    return await email.save();
  }
}
