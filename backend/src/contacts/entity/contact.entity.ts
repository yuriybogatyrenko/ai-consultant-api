import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ContactMessage } from './contact-message.entity';
import { ContactThread } from './contact-thread.entity';
import { Account } from 'src/accounts/entity/account.entity';
import { PlatformsEnum } from 'src/enums/platforms.enum';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  contact_id: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  platform: PlatformsEnum;

  @Column({ nullable: true, unique: true })
  platform_user_id: string;

  @Column({ nullable: true })
  platform_username: string;

  @Column({ nullable: true })
  language_code: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  email: string;

  @OneToMany(() => ContactMessage, (message) => message.contact)
  messages: ContactMessage[];

  @OneToOne(() => ContactThread, (thread) => thread.contact)
  thread: ContactThread;

  @ManyToOne(() => Account, (account) => account.contacts)
  @JoinColumn()
  account: Account;
}
