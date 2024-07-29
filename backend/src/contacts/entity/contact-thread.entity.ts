import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contact } from './contact.entity';
import { ContactMessage } from './contact-message.entity';

@Entity()
export class ContactThread {
  @PrimaryGeneratedColumn('uuid')
  thread_id: string;

  @ManyToOne(() => Contact, (contact) => contact.threads)
  contact: Contact;

  @OneToMany(() => ContactMessage, (message) => message.thread)
  messages: ContactMessage[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
