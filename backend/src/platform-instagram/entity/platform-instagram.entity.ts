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
export class PlatformInstagramSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Account, (acocunt) => acocunt.instagram_settings)
  @JoinColumn()
  account: Account;

  @Column()
  access_token: string;

  @Column()
  instagram_user_id: string;

  @Column()
  instagram_username: string;

  @Column()
  token_type: string;

  @Column()
  expires_in: number;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @CreateDateColumn()
  connected_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
