import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHeadsignsView1588505934036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO timetable_headsigns
        SELECT route_id,
               trip_headsign
        FROM timetable_trips
        GROUP BY route_id,
                 trip_headsign
      `);
  }

  public async down(): Promise<void> {}
}
