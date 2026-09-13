import { ICatFactClient } from '../interfaces/ICatFactClient.js';
import { IFileStorageService } from '../interfaces/IFileStorageService.js';
import { ICatFactService } from '../interfaces/ICatFactService.js';
import { FactStatistics, FetchResult, FileStatsInfo, MisiaProfile } from '../types.js';

export class CatFactService implements ICatFactService {
  private requestsMadeCount: number = 0;
  private latestFactText: string | null = null;
  private latestFactLength: number = 0;

  /**
   * Constructor Injection (Dependency Injection Principle)
   * The dependencies ICatFactClient and IFileStorageService are injected from the outside,
   * enabling high cohesion, low coupling, and testability.
   */
  constructor(
    private readonly catFactClient: ICatFactClient,
    private readonly fileStorageService: IFileStorageService
  ) {}

  async executeFactFetchAndAppend(
    source: 'ninja' | 'tuxedo' | 'misia' = 'ninja',
    format: 'formatted' | 'raw' = 'formatted'
  ): Promise<FetchResult> {
    this.requestsMadeCount += 1;

    // 1. Fetch fact based on source
    let factResponse;
    if (source === 'ninja') {
      // Primary requirement: endpoint https://catfact.ninja/fact
      factResponse = await this.catFactClient.fetchRandomFact();
    } else if (source === 'misia') {
      factResponse = await this.catFactClient.fetchTuxedoFact('misia');
    } else {
      factResponse = await this.catFactClient.fetchTuxedoFact('tuxedo');
    }

    this.latestFactText = factResponse.fact;
    this.latestFactLength = factResponse.length;

    // 2. Format row for .txt file as requested in Requirement 3:
    // Format: YYYY-MM-DD | <Fact text> | <length>
    // e.g.: 2026-09-10 | Cats sleep for around 12-16 hours a day. | 42
    let lineToWrite: string;
    if (format === 'formatted') {
      const today = new Date().toISOString().split('T')[0];
      lineToWrite = `${today} | ${factResponse.fact} | ${factResponse.length}`;
    } else {
      lineToWrite = factResponse.fact;
    }

    // 3. Append to local .txt file in a new line (LF)
    const { lineCount } = await this.fileStorageService.appendLine(lineToWrite);

    return {
      success: true,
      fact: factResponse,
      appendedLine: lineToWrite,
      lineIndex: lineCount,
      totalLines: lineCount,
      timestamp: new Date().toISOString(),
      source,
      format
    };
  }

  async getStatistics(): Promise<FactStatistics> {
    const lines = await this.fileStorageService.readAllLines();
    const validLines = lines.filter(l => l.trim().length > 0);

    let totalLength = 0;
    let shortest = validLines.length > 0 ? Infinity : 0;
    let longest = 0;
    let lastLineFact = this.latestFactText;
    let lastLineLength = this.latestFactLength;

    for (let i = 0; i < validLines.length; i++) {
      const line = validLines[i];
      // Check if line matches: YYYY-MM-DD | fact | length
      const match = line.match(/^\d{4}-\d{2}-\d{2}\s*\|\s*(.+)\s*\|\s*(\d+)$/);
      let len = line.length;
      let text = line;

      if (match) {
        text = match[1].trim();
        len = parseInt(match[2], 10) || text.length;
      }

      totalLength += len;
      if (len < shortest) shortest = len;
      if (len > longest) longest = len;

      if (i === validLines.length - 1 && !this.latestFactText) {
        lastLineFact = text;
        lastLineLength = len;
      }
    }

    if (shortest === Infinity) shortest = 0;

    const averageFactLength = validLines.length > 0 
      ? Math.round(totalLength / validLines.length) 
      : 0;

    // requestsMade is either tracked in-memory or at least the count of saved facts
    const requestsCount = Math.max(this.requestsMadeCount, validLines.length);

    return {
      requestsMade: requestsCount,
      factsSaved: validLines.length,
      averageFactLength,
      shortestFactLength: shortest,
      longestFactLength: longest,
      latestFact: lastLineFact,
      latestFactLength: lastLineLength
    };
  }

  async getFileContent(): Promise<{ lines: string[]; stats: FileStatsInfo; statistics: FactStatistics }> {
    const lines = await this.fileStorageService.readAllLines();
    const stats = await this.fileStorageService.getStats();
    const statistics = await this.getStatistics();
    return { lines, stats, statistics };
  }

  async clearStoredFacts(): Promise<void> {
    await this.fileStorageService.clearFile();
    this.latestFactText = null;
    this.latestFactLength = 0;
    this.requestsMadeCount = 0;
  }

  getStoragePath(): string {
    return this.fileStorageService.getFilePath();
  }

  getMisiaProfile(): MisiaProfile {
    return {
      name: 'Misia',
      gender: 'She / Kotka',
      pattern: 'Tuxedo Bicolour (Piebald)',
      eyeColor: 'Radiant Emerald Green',
      traits: [
        'White mittens on all four paws',
        'Immaculate snowy white chest bib',
        'Sleek obsidian-black tuxedo coat',
        'Curious, chatty, and exceptionally intelligent',
        'Official Quality Assurance Inspector of cat_facts.txt'
      ],
      signatureFact: 'Misia is an elegant female tuxedo cat with a shiny obsidian-black coat, an immaculate white bib, four white mittens, and luminous emerald-green eyes. Like most tuxedo cats, she is remarkably clever, affectionate, and loves to supervise software developers.'
    };
  }
}
