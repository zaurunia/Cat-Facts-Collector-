import { ICatFactClient } from '../interfaces/ICatFactClient.js';
import { CatFactResponse } from '../types.js';

export const MISIA_EXAMPLE_FACT: CatFactResponse = {
  fact: "Misia is an elegant female tuxedo cat with a shiny obsidian-black coat, an immaculate white bib, four white mittens, and luminous emerald-green eyes. Like most tuxedo cats, she is remarkably clever, affectionate, and loves to supervise software developers.",
  length: 254,
  category: 'misia'
};

export const TUXEDO_FACTS: CatFactResponse[] = [
  MISIA_EXAMPLE_FACT,
  {
    fact: "Tuxedo cats are not a distinct breed, but a bicolour (piebald) coat pattern found in domestic shorthairs, Maine Coons, British Shorthairs, and Persians.",
    length: 153,
    category: 'tuxedo'
  },
  {
    fact: "Over 70% of cats portrayed in ancient Egyptian hieroglyphs, murals, and royal tombs display the characteristic tuxedo black-and-white bicolor pattern.",
    length: 151,
    category: 'tuxedo'
  },
  {
    fact: "Tuxedo cats are affectionately called 'black-tie cats' because their crisp white chest bib, paws, and black mantle mimic high-society formal attire.",
    length: 147,
    category: 'tuxedo'
  },
  {
    fact: "Tuxedo kittens are scientifically known to develop exceptionally fast, commonly opening their eyes 24 to 48 hours earlier than other kitten coat varieties.",
    length: 156,
    category: 'tuxedo'
  },
  {
    fact: "Beloved cultural icons like Sylvester the Cat, Felix the Cat, and Dr. Seuss's Cat in the Hat are all world-famous tuxedo cats.",
    length: 126,
    category: 'tuxedo'
  },
  {
    fact: "Socks the Cat, a charismatic tuxedo cat, served as the First Pet of the United States in the White House throughout the 1990s.",
    length: 128,
    category: 'tuxedo'
  },
  {
    fact: "William Shakespeare, Sir Isaac Newton, and Ludwig van Beethoven all famously lived with and cherished tuxedo cats.",
    length: 114,
    category: 'tuxedo'
  },
  {
    fact: "Misia, our star tuxedo cat, loves curling up near warm monitors, greeting visitors with gentle headbutts, and purring while new facts are written to cat_facts.txt.",
    length: 165,
    category: 'misia'
  }
];

export class CatFactClient implements ICatFactClient {
  private readonly endpoint: string;

  constructor(endpoint: string = 'https://catfact.ninja/fact') {
    this.endpoint = endpoint;
  }

  async fetchRandomFact(): Promise<CatFactResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(this.endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CatFactCollector/1.0 (Microsoft-TypeScript-DI; TuxedoCat-Misia)'
        },
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as CatFactResponse;

      if (!data || typeof data.fact !== 'string') {
        throw new Error('Invalid response structure received from catfact.ninja API');
      }

      return {
        fact: data.fact.trim(),
        length: typeof data.length === 'number' ? data.length : data.fact.length,
        category: 'general'
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown network error';
      throw new Error(`Failed to fetch cat fact from ${this.endpoint}: ${message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async fetchTuxedoFact(specificType?: 'tuxedo' | 'misia'): Promise<CatFactResponse> {
    if (specificType === 'misia') {
      const misiaFacts = TUXEDO_FACTS.filter(f => f.category === 'misia');
      const chosen = misiaFacts[Math.floor(Math.random() * misiaFacts.length)] || MISIA_EXAMPLE_FACT;
      return chosen;
    }

    const factsPool = specificType === 'tuxedo'
      ? TUXEDO_FACTS.filter(f => f.category === 'tuxedo')
      : TUXEDO_FACTS;

    const randomIndex = Math.floor(Math.random() * factsPool.length);
    return factsPool[randomIndex] || MISIA_EXAMPLE_FACT;
  }
}
