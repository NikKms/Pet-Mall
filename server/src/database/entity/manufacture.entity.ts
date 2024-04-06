import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import Good from './goods.entity';
import { UserRole } from './admins.entity';

@Entity()
@Unique(['name'])
class Manufacture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ select: false, default: null })
  managerId: number;

  @Column({ select: false, type: 'enum', enum: UserRole, default: null })
  role: string;

  @OneToMany(() => Good, (good) => good.manufacture)
  goods: Good[];
}

export default Manufacture;
