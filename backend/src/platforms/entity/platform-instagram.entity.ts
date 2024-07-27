import { Account } from 'src/accounts/entity/account.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class InstagramSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (acocunt) => acocunt.instagramSettings)
  @JoinColumn()
  account: Account;

  @Column()
  accessToken: string;

  @Column()
  instagramUserId: string;

  @Column()
  instagramUsername: string;

  @Column()
  tokenType: string;

  @Column()
  expiresIn: number;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @CreateDateColumn()
  connectedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
