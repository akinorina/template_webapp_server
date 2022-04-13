import { MigrationInterface, QueryRunner } from "typeorm"

export class User1649827230474 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT \`user\` SET
                \`id\` = 1,
                \`familyName\` = "管理",
                \`firstName\` = "者",
                \`familyNameKana\` = "かんり",
                \`firstNameKana\` = "しゃ",
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
