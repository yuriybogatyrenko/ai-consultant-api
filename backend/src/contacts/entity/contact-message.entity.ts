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
import { UserEntity } from 'src/users/user.entity';
import { MessageType } from '../enums/message-type.enum';
import { MessageDirection } from '../enums/message-direction.enum';

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

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  platoform_message_id: string;

  @Column({ nullable: true })
  platform: PlatformsEnum;

  @Column({
    type: 'enum',
    enum: MessageType,
    nullable: true,
    default: MessageType.Text,
  })
  message_type: string;

  @Column({
    type: 'enum',
    enum: MessageDirection,
    default: MessageDirection.System,
    nullable: true,
  })
  message_direction: string;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn()
  user: UserEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
