import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { IFileStorageService } from '../interfaces/IFileStorageService.js';
import { FileStatsInfo } from '../types.js';

export class FileStorageService implements IFileStorageService {
  private readonly targetFilePath: string;

  constructor(fileName: string = 'cat_facts.txt') {
    // Save to project root or specified path
    this.targetFilePath = path.isAbsolute(fileName)
      ? fileName
      : path.resolve(process.cwd(), fileName);
  }

  getFilePath(): string {
    return this.targetFilePath;
  }

  async ensureFileExists(): Promise<void> {
    const dir = path.dirname(this.targetFilePath);
    if (!fsSync.existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }

    if (!fsSync.existsSync(this.targetFilePath)) {
      await fs.writeFile(this.targetFilePath, '', { encoding: 'utf-8' });
    }
  }

  async appendLine(text: string): Promise<{ lineCount: number; bytesWritten: number }> {
    await this.ensureFileExists();

    // Format new line: clean single line with newline at end
    const sanitizedLine = text.replace(/[\r\n]+/g, ' ').trim();
    const lineWithBreak = `${sanitizedLine}\n`;

    await fs.appendFile(this.targetFilePath, lineWithBreak, { encoding: 'utf-8' });

    const stats = await this.getStats();
    return {
      lineCount: stats.lineCount,
      bytesWritten: Buffer.byteLength(lineWithBreak, 'utf-8')
    };
  }

  async readAllLines(): Promise<string[]> {
    if (!fsSync.existsSync(this.targetFilePath)) {
      return [];
    }

    const content = await fs.readFile(this.targetFilePath, { encoding: 'utf-8' });
    if (!content || content.trim().length === 0) {
      return [];
    }

    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  async getStats(): Promise<FileStatsInfo> {
    const exists = fsSync.existsSync(this.targetFilePath);
    if (!exists) {
      return {
        exists: false,
        sizeBytes: 0,
        lineCount: 0,
        filePath: this.targetFilePath,
        lastModified: null
      };
    }

    const stat = await fs.stat(this.targetFilePath);
    const lines = await this.readAllLines();

    return {
      exists: true,
      sizeBytes: stat.size,
      lineCount: lines.length,
      filePath: this.targetFilePath,
      lastModified: stat.mtime.toISOString()
    };
  }

  async clearFile(): Promise<void> {
    await fs.writeFile(this.targetFilePath, '', { encoding: 'utf-8' });
  }
}
