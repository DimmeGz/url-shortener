import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ShortenUrl extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shorten_url: string;

  @Column()
  full_url: string;

  @Column()
  usage_count: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  owner: User;
}
