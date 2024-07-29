import { Account } from 'src/accounts/entity/account.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class PlatformWhatsAppSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Account, (account) => account.whatsapp_settings)
  account: Account;

  @Column()
  access_token: string;

  @Column()
  phone_number_id: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @CreateDateColumn()
  connected_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
