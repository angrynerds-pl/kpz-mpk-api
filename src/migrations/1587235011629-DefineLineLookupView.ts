/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from "typeorm";

export class DefineLineLookupView1587235011629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                create materialized view line_lookup as
                select s.line,
                      t.route_id,
                      t.trip_headsign,
                      array_agg(t.trip_id) trip_ids
                from (
                      select shape_id,
                              st_makeline(
                                ST_SetSRID(st_makepoint(
                                            s.shape_pt_lon,
                                            s.shape_pt_lat
                                            ), 4326),
                                ST_SetSRID(st_makepoint(
                                              lead(s.shape_pt_lon) over (partition by s.shape_id order by s.shape_pt_sequence),
                                              lead(s.shape_pt_lat) over (partition by s.shape_id order by s.shape_pt_sequence)
                                            ), 4326)
                                ) line
                      from timetable_shape s
                    ) s
                      left join timetable_trips t on s.shape_id = t.shape_id
                where line is not null
                group by s.line,
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
