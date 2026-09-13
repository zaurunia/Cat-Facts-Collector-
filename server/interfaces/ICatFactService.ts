import { CatFactResponse, FactStatistics, FetchResult, FileStatsInfo, MisiaProfile } from '../types.js';

/**
 * Main application service coordinating the fetching from catfact.ninja / tuxedo facts
 * and saving to local .txt file.
 */
export interface ICatFactService {
  executeFactFetchAndAppend(
    source?: 'ninja' | 'tuxedo' | 'misia',
    format?: 'formatted' | 'raw'
  ): Promise<FetchResult>;
  getFileContent(): Promise<{ lines: string[]; stats: FileStatsInfo; statistics: FactStatistics }>;
  getStatistics(): Promise<FactStatistics>;
  clearStoredFacts(): Promise<void>;
  getStoragePath(): string;
  getMisiaProfile(): MisiaProfile;
}
