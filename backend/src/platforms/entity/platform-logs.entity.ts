import { UserEntity } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Platform } from './platform.entity';

@Entity()
export class PlatformLogs {
  @PrimaryGeneratedColumn()
  log_id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => Platform, { eager: true })
  platform: Platform;

  @Column()
  interactionType: string;

  @Column('text')
  interactionDetails: string;

  @CreateDateColumn()
  timestamp: Date;
}
