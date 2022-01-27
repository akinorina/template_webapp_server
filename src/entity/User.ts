/**
 * User
 */
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"

// ユーザー権限
type UserType = 'admin' | 'user' | undefined

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: 'ユーザーID' })
  id: number = 0;

  @Column({ default: '', comment: '氏名' })
  name: string = "";

  @Column({ default: '', comment: '氏名かな' })
  nameKana: string = "";

  @Column({ default: '', comment: 'Emailアドレス' })
  email: string = "";

  @Column({ default: '', comment: 'パスワード' })
  password: string = "";

  @Column({ type: "varchar", default: 'user', comment: 'ユーザー種別 (admin|user)' })
  userType: UserType = undefined;

  @CreateDateColumn({ comment: '作成日時' })
  createdAt: string | undefined = undefined;

  @UpdateDateColumn({ comment: '更新日時' })
  updatedAt: string | undefined = undefined;

  @DeleteDateColumn({ comment: '削除日時' })
  deletedAt: string | undefined = undefined;
}
 