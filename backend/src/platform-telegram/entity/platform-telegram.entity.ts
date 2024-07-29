import { Account } from 'src/accounts/entity/account.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class PlatformTelegramSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Account, (account) => account.telegram_settings)
  @JoinColumn()
  account: Account;

  @Column()
  access_token: string;

  @Column()
  bot_username: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @CreateDateColumn()
  connected_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
