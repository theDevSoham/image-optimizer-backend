import { parse } from "csv-parse";
import { Readable } from "stream";

export const parseCSV = (
  csvData: string
): Promise<{ header: string[]; rows: string[][] }> => {
  return new Promise((resolve, reject) => {
    let header: string[] | null = null;
    const rows: string[][] = [];
    const parser = parse({
      trim: true,
      skip_empty_lines: true,
      from_line: 1, // start from the first line so header is included
    });

    Readable.from(csvData)
      .pipe(parser)
      .on("data", (row: string[]) => {
        if (!header) {
          header = row;
        } else {
          rows.push(row);
        }
      })
      .on("end", () => resolve({ header: header || [], rows }))
      .on("error", (err) => reject(err));
  });
};
