import { FileStatsInfo } from '../types.js';

/**
 * Interface for local file storage operations.
 * Handles creating the .txt file and appending lines.
 */
export interface IFileStorageService {
  ensureFileExists(): Promise<void>;
  appendLine(text: string): Promise<{ lineCount: number; bytesWritten: number }>;
  readAllLines(): Promise<string[]>;
  getStats(): Promise<FileStatsInfo>;
  clearFile(): Promise<void>;
  getFilePath(): string;
}
