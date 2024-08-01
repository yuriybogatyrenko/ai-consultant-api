import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Contact } from './contact.entity';
import { ContactMessage } from './contact-message.entity';
import { UserEntity } from 'src/users/user.entity';

export enum ThreadStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  CLOSED = 'closed',
  PENDING = 'pending',
}

@Entity()
export class ContactThread {
  @PrimaryGeneratedColumn('uuid')
  thread_id: string;

  @Column({ nullable: true })
  gpt_thread_id: string;

  @OneToOne(() => Contact, (contact) => contact.thread)
  @JoinColumn()
  contact: Contact;

  @OneToMany(() => ContactMessage, (message) => message.thread)
  messages: ContactMessage[];

  @Column({
    type: 'enum',
    enum: ThreadStatus,
    default: ThreadStatus.ACTIVE,
  })
  status: ThreadStatus;

  @ManyToOne(() => UserEntity, (user) => user.threads)
  @JoinColumn()
  user: UserEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
