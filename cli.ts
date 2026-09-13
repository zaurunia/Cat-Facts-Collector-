#!/usr/bin/env tsx
import { createConfiguredContainer, ServiceTokens } from './server/di/container.js';
import { ICatFactService } from './server/interfaces/ICatFactService.js';

async function main() {
  // Initialize Dependency Injection Container
  const container = createConfiguredContainer();
  const catFactService = container.resolve<ICatFactService>(ServiceTokens.CatFactService);

  const args = process.argv.slice(2);
  const countArg = args.find(a => a.startsWith('--count='))?.split('=')[1] || '1';
  const count = Math.min(Math.max(parseInt(countArg, 10) || 1, 1), 20);

  console.log(`[DI] Resolved ICatFactService from ServiceContainer.`);
  console.log(`[Storage] Target file: ${catFactService.getStoragePath()}`);
  console.log(`[Request] Executing ${count} request(s) to https://catfact.ninja/fact...\n`);

  for (let i = 0; i < count; i++) {
    try {
      const result = await catFactService.executeFactFetchAndAppend('ninja', 'formatted');
      console.log(`[${i + 1}/${count}] [+] Zapisano wiersz: ${result.appendedLine}`);
    } catch (err: unknown) {
      console.error(`[!] Błąd zapytania ${i + 1}:`, err instanceof Error ? err.message : err);
    }
  }

  const { stats, lines, statistics } = await catFactService.getFileContent();

  console.log('\n' + '='.repeat(35));
  console.log('=== Cat Fact Collector ===');
  console.log('='.repeat(35));
  console.log(`\nRequests made: ${statistics.requestsMade}`);
  console.log(`Facts saved: ${statistics.factsSaved}`);
  console.log(`Average fact length: ${statistics.averageFactLength} characters\n`);

  console.log('Latest fact:');
  console.log(statistics.latestFact || '(none)');
  console.log('');

  if (args.includes('--show') || lines.length <= 5) {
    console.log('Plik:\n');
    lines.slice(-10).forEach(line => console.log(line));
    console.log('');
  }
}

main().catch(err => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
