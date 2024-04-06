import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserRole } from './admins.entity';

@Entity()
@Unique(['name'])
class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ select: false, default: null })
  managerId: number;

  @Column({ select: false, type: 'enum', enum: UserRole, default: null })
  role: string;
}

export default Tag;
