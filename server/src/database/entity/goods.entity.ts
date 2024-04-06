import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import Manufacture from './manufacture.entity';
import Appoint from './appoint.entity';
import Tag from './tag.entity';
import { UserRole } from './admins.entity';

@Entity()
@Unique(['name'])
class Good {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ type: 'float' })
  price: number;

  @Column()
  image: string;

  @Column({ select: false, default: null })
  managerId: number;

  @Column({ select: false, type: 'enum', enum: UserRole, default: null })
  role: string;

  @ManyToOne(() => Manufacture, (manufacture) => manufacture.goods)
  manufacture: Manufacture;

  @ManyToOne(() => Appoint, (appoint) => appoint.goods, { onDelete: 'CASCADE' })
  appoint: Appoint;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}

export default Good;
