import { BadRequestException, Injectable } from '@nestjs/common';
import { DepositTypeNameRepository } from './infrastructure/persistence/deposit-type-name.repository';
import { CreateDepositTypeNameDto } from './dto/create-deposit-type-name.dto';
import { DepositTypeName } from './domain/deposit-type-name';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class DepositTypeNamesService {
  constructor(
    private readonly depositTypeNameRepository: DepositTypeNameRepository,
  ) {}

  create(dtName: CreateDepositTypeNameDto): Promise<DepositTypeName> {
    try {
      const depositTypeName = new DepositTypeName();
      depositTypeName.name = dtName.name;
      return this.depositTypeNameRepository.create(depositTypeName);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505' // PostgreSQL unique violation
      ) {
        throw new BadRequestException('Deposit type name already exists');
      }

      // Optionally handle other DB-related errors
      throw error;
    }
  }

  findAll(): Promise<DepositTypeName[]> {
    return this.depositTypeNameRepository.findAll();
  }

  remove(id: DepositTypeName['id']): Promise<void> {
    return this.depositTypeNameRepository.delete(id);
  }
}
