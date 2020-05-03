import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLineLookUpIndex1587236765846 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE INDEX line_lookup_index
        ON line_lookup USING gist (line)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
       DROP INDEX line_lookup_index
      `);
  }
}
