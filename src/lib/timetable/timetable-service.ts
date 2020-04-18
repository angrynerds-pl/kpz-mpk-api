import fs from "fs";
import csvParse from "csv-parse";
import semaphoreFactory from "semaphore";
import { notFound } from "@hapi/boom";

// it's a timetable cache
// it stores lazy parsed timetable files
const timetable = new Map(
  fs.readdirSync("assets/timetable").map(filename => {
    const file = filename.split(".", 2)[0];

    return [
      file,
      [null, semaphoreFactory()] as [
        {}[] | null,
        ReturnType<typeof semaphoreFactory>
      ]
    ];
  })
);

export const listTimetableFiles = timetable.keys.bind(timetable);

export function readTimetableFile(filename: string): Promise<{}[]> {
  return new Promise((resolve, reject) => {
    const file = timetable.get(filename);

    if (!file) {
      reject(notFound());
      return;
    }

    const [cachedResponse, semaphore] = file;

    // fast path without semaphore
    // it's save when response is already cached
    if (cachedResponse) {
      resolve(cachedResponse);
      return;
    }

    // if not start parsing
    // but ensure that only one request triggers parsing
    // and the rest will just wait for the result
    semaphore.take(() => {
      // try again fetching the response from cache
      // because if it's a waiting request the response will already
      // be there

      // it's save because this filename was validated earlier
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const freshCache = timetable.get(filename)!;
      if (freshCache[0]) {
        semaphore.leave();
        resolve(freshCache[0]);
        return;
      }

      // if there is no cache read the timetable from csv
      const parser = fs
        .createReadStream(`assets/timetable/${filename}.txt`)
        .pipe(csvParse({ columns: true }));

      const newResponse: {}[] = [];

      (async () => {
        // eslint-disable-next-line no-restricted-syntax
        for await (const route of parser) {
          newResponse.push(route);
        }
      })()
        .then(() => {
          freshCache[0] = newResponse;
          resolve(newResponse);
        })
        .catch(reject)
        .finally(() => semaphore.leave());
    });
  });
}
