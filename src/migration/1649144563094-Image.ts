import { MigrationInterface, QueryRunner } from "typeorm";

export class Image1649144563094 implements MigrationInterface {
    name = 'Image1649144563094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`image\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT '画像ID', \`userId\` int NOT NULL COMMENT '所有者ユーザーID' DEFAULT '0', \`fileName\` varchar(255) NOT NULL COMMENT 'ファイル名' DEFAULT '', \`fileMimetype\` varchar(255) NOT NULL COMMENT 'ファイルmime-type' DEFAULT '', \`filePath\` varchar(255) NOT NULL COMMENT '物理ファイル相対パス' DEFAULT '', \`fileUrl\` varchar(255) NOT NULL COMMENT '画像URLパス' DEFAULT '', \`createdAt\` timestamp(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL COMMENT '削除日時', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`image\``);
    }

}
