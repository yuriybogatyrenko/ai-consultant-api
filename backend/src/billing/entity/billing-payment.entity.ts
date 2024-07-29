import { Account } from 'src/accounts/entity/account.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Subscription } from './billing-subscription.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  payment_id: string;

  @ManyToOne(() => Account, (account) => account.payments)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Subscription, (subscription) => subscription.payments)
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  payment_method: string;

  @Column()
  payment_status: string;

  @Column()
  transaction_id: string;

  @CreateDateColumn()
  payment_date: Date;
}
