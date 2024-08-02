import { Contact } from 'src/contacts/entity/contact.entity';
import {
  AfterInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContactCustomFieldValue } from './contact-custom-field-value.entity';
import { Account } from 'src/accounts/entity/account.entity';

@Entity()
export class ContactCustomField {
  @PrimaryGeneratedColumn('increment')
  custom_field_id: number;

  @Column({ unique: true, nullable: true })
  prefixed_field_id: string;

  @Column()
  field_name: string;

  @Column({ type: 'enum', enum: ['text', 'number', 'date', 'boolean'] })
  type: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => Account, (account) => account.contact_custom_fields)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToMany(() => ContactCustomFieldValue, (value) => value.customField)
  values: ContactCustomFieldValue[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @AfterInsert()
  setPrefixedId() {
    this.prefixed_field_id = `ccf_${this.custom_field_id}`;
  }
}
