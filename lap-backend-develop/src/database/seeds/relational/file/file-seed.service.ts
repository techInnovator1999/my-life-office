import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileSeedService {
  private readonly sheetFilePath = join(
    __dirname,
    '../seed-carriers-profile-data.xlsx',
  );

  private readonly seedFilePath = join(__dirname, '../seed-data.json');

  constructor() {}

  readSheetNames(): string[] {
    const workbook = XLSX.readFile(this.sheetFilePath);
    return workbook.SheetNames;
  }

  readJsonFile(): any | null {
    if (!existsSync(this.seedFilePath)) {
      console.log(`⚠️ seed-data.json not found. Skipping seed.`);
      return null;
    }

    try {
      const content = readFileSync(this.seedFilePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('❌ Failed to parse seed-data.json:', error);
      return null;
    }
  }

  readCsvFile(): {
    sheetName: string;
    rows: unknown[];
  }[] {
    if (!existsSync(this.sheetFilePath)) {
      console.log(`⚠️ CSV file not found: ${this.sheetFilePath}`);
      return [];
    }

    const workbook = XLSX.readFile(this.sheetFilePath);
    return workbook.SheetNames.map((sheet) => ({
      sheetName: sheet,
      rows: XLSX.utils.sheet_to_json(workbook.Sheets[sheet]),
    }));
  }

  run() {
    const workbook = XLSX.readFile(this.sheetFilePath);
    const sheetNames = workbook.SheetNames;
    console.log('Got total sheets: ', sheetNames.length);
  }
}
