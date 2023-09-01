import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
