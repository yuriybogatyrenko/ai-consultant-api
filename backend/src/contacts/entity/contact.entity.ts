import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ContactMessage } from './contact-message.entity';
import { ContactThread } from './contact-thread.entity';
import { Account } from 'src/accounts/entity/account.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  contact_id: string;

  @Column()
  name: string;

  @Column()
  platform: string;

  @Column()
  platform_user_id: string;

  @OneToMany(() => ContactMessage, (message) => message.contact)
  messages: ContactMessage[];

  @OneToMany(() => ContactThread, (thread) => thread.contact)
  threads: ContactThread[];

  @ManyToOne(() => Account, (account) => account.contacts)
  account: Account;
}
