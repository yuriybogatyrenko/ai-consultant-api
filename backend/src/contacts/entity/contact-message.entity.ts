import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contact } from './contact.entity';
import { ContactThread } from './contact-thread.entity';

@Entity()
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  message_id: string;

  @ManyToOne(() => ContactThread, (thread) => thread.messages)
  thread: ContactThread;

  @ManyToOne(() => Contact, (contact) => contact.messages)
  contact: Contact;

  @Column({ type: 'text' })
  content: string;

  @Column()
  platform: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
