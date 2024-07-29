import { Account } from 'src/accounts/entity/account.entity';
import { UserEntity } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AccountTeamMember {
  @PrimaryGeneratedColumn()
  member_id: number;

  @ManyToOne(() => Account, (account) => account.team_members)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'enum', enum: ['admin', 'member'] })
  role: string; // 'admin', 'member', etc.

  @Column('json')
  permissions: Record<string, any>; // Permissions, e.g., { "chat": true, "manage": false }

  @CreateDateColumn()
  joined_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
