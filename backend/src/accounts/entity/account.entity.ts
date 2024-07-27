import { AccountTeamMember } from 'src/account-team/entity/account-team-member.entity';
import { ApiKeyEntity } from 'src/api-keys/api-keys.entity';
import { Payment } from 'src/billing/entity/billing-payment.entity';
import { Subscription } from 'src/billing/entity/billing-subscription.entity';
import { InstagramSetting } from 'src/platforms/entity/platform-instagram.entity';
import { TelegramSetting } from 'src/platforms/entity/platform-telegram.entity';
import { WhatsAppSetting } from 'src/platforms/entity/platform-whatsapp-settings.entity';
import { UserEntity } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
  apiKeys: ApiKeyEntity[];

  @OneToMany(() => TelegramSetting, (setting) => setting.account)
  telegramSettings: TelegramSetting[];

  @OneToMany(() => WhatsAppSetting, (setting) => setting.account)
  whatsappSettings: WhatsAppSetting[];

  @OneToMany(() => InstagramSetting, (setting) => setting.account)
  instagramSettings: InstagramSetting[];

  @OneToMany(() => Payment, (payment) => payment.account)
  payments: Payment[];

  @OneToMany(() => Subscription, (subscription) => subscription.account)
  subscriptions: Subscription[];

  @OneToMany(() => AccountTeamMember, (member) => member.account)
  teamMembers: AccountTeamMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
