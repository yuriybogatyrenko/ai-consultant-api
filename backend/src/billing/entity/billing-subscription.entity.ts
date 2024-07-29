import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Plan } from './billing-plan.entity';
import { Account } from 'src/accounts/entity/account.entity';
import { Payment } from './billing-payment.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  subscription_id: string;

  @ManyToOne(() => Account, (account) => account.subscriptions)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column()
  status: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
