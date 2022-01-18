/**
 * User
 */
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"

// ユーザー権限
type UserType = 'admin' | 'user' | undefined

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ default: '' })
  name: string = "";

  @Column({ default: '' })
  nameKana: string = "";

  @Column({ default: '' })
  email: string = "";

  @Column({ default: '' })
  password: string = "";

  @Column({ type: "varchar", default: 'customer' })
  userType: UserType = undefined;

  @CreateDateColumn()
  createdAt: string | undefined = undefined;

  @UpdateDateColumn()
  updatedAt: string | undefined = undefined;

  @DeleteDateColumn()
  deletedAt: string | undefined = undefined;
}
 