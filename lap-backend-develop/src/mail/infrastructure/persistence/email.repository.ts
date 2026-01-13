import { Email } from './relational/entities/mail.entity';

export abstract class EmailRepository {
  abstract create(data: Partial<Email>): Promise<Email>;
}
