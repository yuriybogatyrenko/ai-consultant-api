import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApiKeyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @ManyToOne(() => UserEntity, (user) => user.apiKeys)
  user: UserEntity;
}
