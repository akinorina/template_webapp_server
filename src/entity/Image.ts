/**
 * Image - 画像
 */
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"

@Entity()
export class Image extends BaseEntity {

  /**
   * 画像ID
   */
  @PrimaryGeneratedColumn({ comment: '画像ID' })
  id: number = 0;

  /**
   * 所有者ユーザーID
   */
  @Column({ default: 0, comment: '所有者ユーザーID' })
  user_id: number = 0;

  /**
   * ファイル名
   */
  @Column({ default: '', comment: 'ファイル名' })
  name: string = "";

  /**
   * 物理ファイル相対パス
   */
  @Column({ default: '', comment: '物理ファイル相対パス' })
  filePath: string = "";

  /**
   * 画像URLパス
   */
  @Column({ default: '', comment: '画像URLパス' })
  fileUrl: string = "";

  /**
   * 作成日時
   */
  @CreateDateColumn({ comment: '作成日時' })
  createdAt: string | undefined = undefined;

  /**
   * 更新日時
   */
  @UpdateDateColumn({ comment: '更新日時' })
  updatedAt: string | undefined = undefined;

  /**
   * 削除日時
   */
  @DeleteDateColumn({ comment: '削除日時' })
  deletedAt: string | undefined = undefined;
}
 