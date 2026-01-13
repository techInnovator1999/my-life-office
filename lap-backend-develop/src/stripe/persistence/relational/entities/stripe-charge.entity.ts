import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Allow, IsNumber, IsString, IsOptional } from 'class-validator';

@Entity()
export class StripeChargeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @Column({ type: String })
  chargeId: string;

  @Allow()
  @Column({ type: String })
  @IsString()
  status: string;

  @Allow()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  amountCaptured: number;

  @Allow()
  @Column({ type: String })
  @IsOptional()
  description: string | null;

  @Allow()
  @Column({ type: String })
  @IsOptional()
  customer: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
