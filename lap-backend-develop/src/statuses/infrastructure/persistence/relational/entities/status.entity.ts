import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { Status } from '../../../../domain/status';

@Entity({
  name: 'status',
})
export class StatusEntity extends EntityRelationalHelper implements Status {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name?: string;
}
