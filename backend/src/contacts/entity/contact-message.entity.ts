import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Contact } from './contact.entity';
import { ContactThread } from './contact-thread.entity';
import { PlatformsEnum } from 'src/enums/platforms.enum';

@Entity()
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  message_id: string;

  @ManyToOne(() => ContactThread, (thread) => thread.messages)
  @JoinColumn()
  thread: ContactThread;

  @ManyToOne(() => Contact, (contact) => contact.messages)
  @JoinColumn()
  contact: Contact;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  platoform_message_id: string;

  @Column()
  platform: PlatformsEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
