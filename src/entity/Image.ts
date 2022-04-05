/**
 * Image - 画像
 */
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"

@Entity()
export class Image extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: '画像ID' })
  id: number = 0;

  @Column({ default: 0, comment: '所有者ユーザーID' })
  userId: number = 0;

  @Column({ default: '', comment: 'ファイル名' })
  fileName: string = "";

  @Column({ default: '', comment: 'ファイルmime-type' })
  fileMimetype: string = "";

  @Column({ default: '', comment: '物理ファイル相対パス' })
  filePath: string = "";

  @Column({ default: '', comment: '画像URLパス' })
  fileUrl: string = "";

  @CreateDateColumn({ comment: '作成日時', type: 'timestamp', precision: 6, nullable: false })
  createdAt: Date | number | undefined = undefined

  @UpdateDateColumn({ comment: '更新日時', type: 'timestamp', precision: 6, nullable: false })
  updatedAt: Date | number | undefined = undefined

  @DeleteDateColumn({ comment: '削除日時', type: 'timestamp', precision: 6, nullable: true, default: null })
  deletedAt: Date | number | undefined = undefined
}
 