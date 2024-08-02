import { Account } from 'src/accounts/entity/account.entity';
import {
  AfterInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AccountCustomField {
  @PrimaryGeneratedColumn('increment')
  custom_field_id: number;

  @Column({ unique: true, nullable: true })
  prefixed_field_id: string;

  @Column()
  field_name: string;

  @Column()
  field_value: string;

  @Column({ type: 'enum', enum: ['text', 'number', 'date', 'boolean'] })
  type: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => Account, (account) => account.custom_fields)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @AfterInsert()
  setPrefixedId() {
    this.prefixed_field_id = `acf_${this.custom_field_id}`;
  }
}
