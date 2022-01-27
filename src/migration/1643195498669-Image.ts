import {MigrationInterface, QueryRunner} from "typeorm";

export class Image1643195498669 implements MigrationInterface {
    name = 'Image1643195498669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`image\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT '画像ID', \`user_id\` int NOT NULL COMMENT '所有者ユーザーID' DEFAULT '0', \`name\` varchar(255) NOT NULL COMMENT 'ファイル名' DEFAULT '', \`filePath\` varchar(255) NOT NULL COMMENT '物理ファイル相対パス' DEFAULT '', \`fileUrl\` varchar(255) NOT NULL COMMENT '画像URLパス' DEFAULT '', \`createdAt\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '削除日時', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`image\``);
    }

}
