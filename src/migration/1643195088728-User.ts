import {MigrationInterface, QueryRunner} from "typeorm";

export class User1643195088728 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT \`user\` SET
                \`id\` = 1,
                \`name\` = "管理者",
                \`nameKana\` = "かんりしゃ",
                \`email\` = "admin@example.com",
                \`password\` = "admin",
                \`userType\` = "admin",
                \`createdAt\` = DEFAULT,
                \`updatedAt\` = DEFAULT,
                \`deletedAt\` = DEFAULT`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM \`user\` WHERE id = 1`
        );
    }


}
