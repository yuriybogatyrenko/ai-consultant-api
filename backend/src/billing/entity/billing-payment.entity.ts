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
  @JoinColumn()
  account: Account;

  @ManyToOne(() => Subscription, (subscription) => subscription.payments)
  @JoinColumn()
  subscription: Subscription;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  paymentMethod: string;

  @Column()
  paymentStatus: string;

  @Column()
  transactionId: string;

  @CreateDateColumn()
  paymentDate: Date;
}
