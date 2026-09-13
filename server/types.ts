export interface CatFactResponse {
  fact: string;
  length: number;
  category?: 'general' | 'tuxedo' | 'misia';
}

export interface FileStatsInfo {
  exists: boolean;
  sizeBytes: number;
  lineCount: number;
  filePath: string;
  lastModified: string | null;
}

export interface FactStatistics {
  requestsMade: number;
  factsSaved: number;
  averageFactLength: number;
  shortestFactLength: number;
  longestFactLength: number;
  latestFact: string | null;
  latestFactLength: number;
}

export interface MisiaProfile {
  name: string;
  gender: string;
  pattern: string;
  eyeColor: string;
  traits: string[];
  signatureFact: string;
}

export interface FetchResult {
  success: boolean;
  fact: CatFactResponse;
  appendedLine: string;
  lineIndex: number;
  totalLines: number;
  timestamp: string;
  source: 'ninja' | 'tuxedo' | 'misia';
  format: 'formatted' | 'raw';
}
