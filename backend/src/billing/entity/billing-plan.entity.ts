import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subscription } from './billing-subscription.entity';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  plan_id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
