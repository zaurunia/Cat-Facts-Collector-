import { CatFactResponse } from '../types.js';

/**
 * Interface for CatFact HTTP client.
 * Decoupled to allow mocking, unit testing, and swapping HTTP transports.
 */
export interface ICatFactClient {
  fetchRandomFact(): Promise<CatFactResponse>;
  fetchTuxedoFact(specificType?: 'tuxedo' | 'misia'): Promise<CatFactResponse>;
}
