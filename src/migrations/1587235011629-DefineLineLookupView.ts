/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from "typeorm";

export class DefineLineLookupView1587235011629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                CREATE MATERIALIZED VIEW line_lookup AS
                SELECT s.line,
                       t.route_id,
                       t.trip_headsign
                FROM (
                      SELECT shape_id,
                              ST_MakeLine(
                                ST_SetSRID(ST_MakePoint(
                                            s.shape_pt_lon,
                                            s.shape_pt_lat
                                            ), 4326),
                                ST_SetSRID(ST_MakePoint(
                                              lead(s.shape_pt_lon) OVER (partition by s.shape_id order by s.shape_pt_sequence),
                                              lead(s.shape_pt_lat) OVER (partition by s.shape_id order by s.shape_pt_sequence)
                                            ), 4326)
                                ) line
                      FROM timetable_shape s
                    ) s
                LEFT JOIN timetable_trips t on s.shape_id = t.shape_id
                WHERE line IS NOT NULL
                GROUP BY s.line,
                         t.route_id,
                         t.trip_headsign
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop materialized view line_lookup
    `);
  }
}
