export interface CatFactItem {
  fact: string;
  length: number;
  category?: 'general' | 'tuxedo' | 'misia';
}

export interface FileStats {
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
  latestFactLength?: number;
}

export interface MisiaProfile {
  name: string;
  gender: string;
  pattern: string;
  eyeColor: string;
  traits: string[];
  signatureFact: string;
}

export interface FetchFactApiResponse {
  success: boolean;
  fact: CatFactItem;
  appendedLine: string;
  lineIndex: number;
  totalLines: number;
  timestamp: string;
  stats: FileStats;
  statistics?: FactStatistics;
  source?: 'ninja' | 'tuxedo' | 'misia';
  format?: 'formatted' | 'raw';
  recentLines?: string[];
  error?: string;
}

export interface FileContentApiResponse {
  success: boolean;
  lines: string[];
  stats: FileStats;
  statistics?: FactStatistics;
  error?: string;
}

export interface DIServiceInfo {
  interface: string;
  implementation: string;
  lifetime: string;
  responsibility: string;
}

export interface DIArchitectureResponse {
  architecture: string;
  platform: string;
  services: DIServiceInfo[];
}
