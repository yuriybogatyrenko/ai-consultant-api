import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContactCustomField } from './contact-custom-field.entity';
import { Contact } from 'src/contacts/entity/contact.entity';

@Entity()
export class ContactCustomFieldValue {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ContactCustomField, (customField) => customField.values)
  @JoinColumn({ name: 'custom_field_id' })
  customField: ContactCustomField;

  @ManyToOne(() => Contact, (contact) => contact.custom_fields_values)
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @Column({ type: 'text', nullable: true })
  value: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
