import { AccountTeamMember } from 'src/account-team/entity/account-team-member.entity';
import { ApiKeyEntity } from 'src/api-keys/api-keys.entity';
import { Payment } from 'src/billing/entity/billing-payment.entity';
import { Subscription } from 'src/billing/entity/billing-subscription.entity';
import { Contact } from 'src/contacts/entity/contact.entity';
import { PlatformInstagramSetting } from 'src/platform-instagram/entity/platform-instagram.entity';
import { PlatformTelegramSetting } from 'src/platform-telegram/entity/platform-telegram.entity';
import { PlatformWhatsAppSetting } from 'src/platform-whatsapp/entity/platform-whatsapp.entity';
import { UserEntity } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  account_id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.accounts)
  @JoinColumn()
  owner: UserEntity;

  @OneToMany(() => ApiKeyEntity, (apiKey) => apiKey.account)
  api_keys: ApiKeyEntity[];

  @OneToOne(() => PlatformTelegramSetting, (setting) => setting.account)
  telegram_settings: PlatformTelegramSetting;

  @OneToOne(() => PlatformWhatsAppSetting, (setting) => setting.account)
  whatsapp_settings: PlatformWhatsAppSetting;

  @OneToOne(() => PlatformInstagramSetting, (setting) => setting.account)
  instagram_settings: PlatformInstagramSetting;

  @OneToMany(() => Payment, (payment) => payment.account)
  payments: Payment[];

  @OneToMany(() => Subscription, (subscription) => subscription.account)
  subscriptions: Subscription[];

  @OneToMany(() => AccountTeamMember, (member) => member.account)
  team_members: AccountTeamMember[];

  @OneToMany(() => Contact, (contact) => contact.account)
  contacts: Contact[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
