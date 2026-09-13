import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createConfiguredContainer, ServiceTokens } from './server/di/container.js';
import { ICatFactService } from './server/interfaces/ICatFactService.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Initialize Dependency Injection Container (Microsoft IoC pattern)
  const container = createConfiguredContainer({
    endpoint: 'https://catfact.ninja/fact',
    storageFileName: 'cat_facts.txt'
  });

  const catFactService = container.resolve<ICatFactService>(ServiceTokens.CatFactService);

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      runtime: 'Node.js (TypeScript)',
      vendor: 'Microsoft TypeScript'
    });
  });

  // POST /api/facts/fetch - Main task requirement: fetch from catfact.ninja or tuxedo/misia and append to .txt
  app.post('/api/facts/fetch', async (req, res) => {
    try {
      const source = (req.body?.source || req.query?.source || 'ninja') as 'ninja' | 'tuxedo' | 'misia';
      const format = (req.body?.format || 'formatted') as 'formatted' | 'raw';
      const result = await catFactService.executeFactFetchAndAppend(source, format);
      const { stats, lines, statistics } = await catFactService.getFileContent();
      res.json({
        ...result,
        stats,
        statistics,
        recentLines: lines.slice(-10)
      });
    } catch (error: unknown) {
      console.error('[Error] /api/facts/fetch:', error);
      const message = error instanceof Error ? error.message : 'Unknown server error';
      res.status(500).json({ success: false, error: message });
    }
  });

  // GET /api/misia/profile - Profile and signature facts of Misia the tuxedo cat
  app.get('/api/misia/profile', (req, res) => {
    res.json({
      success: true,
      profile: catFactService.getMisiaProfile()
    });
  });

  // GET /api/facts/statistics - Real-time statistics requirement 3
  app.get('/api/facts/statistics', async (req, res) => {
    try {
      const statistics = await catFactService.getStatistics();
      res.json({
        success: true,
        statistics
      });
    } catch (error: unknown) {
      console.error('[Error] /api/facts/statistics:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve statistics' });
    }
  });

  // GET /api/facts/file - Read all lines and file statistics
  app.get('/api/facts/file', async (req, res) => {
    try {
      const { lines, stats, statistics } = await catFactService.getFileContent();
      res.json({
        success: true,
        lines,
        stats,
        statistics
      });
    } catch (error: unknown) {
      console.error('[Error] /api/facts/file:', error);
      const message = error instanceof Error ? error.message : 'Failed to read file';
      res.status(500).json({ success: false, error: message });
    }
  });

  // GET /api/facts/download - Download the local .txt file directly
  app.get('/api/facts/download', async (req, res) => {
    try {
      const targetPath = catFactService.getStoragePath();
      if (!fs.existsSync(targetPath)) {
        fs.writeFileSync(targetPath, '', 'utf-8');
      }
      res.download(targetPath, 'cat_facts.txt');
    } catch (error: unknown) {
      res.status(500).send('Unable to download file');
    }
  });

  // POST /api/facts/clear - Reset / clear the file
  app.post('/api/facts/clear', async (req, res) => {
    try {
      await catFactService.clearStoredFacts();
      const { stats, statistics } = await catFactService.getFileContent();
      res.json({ success: true, stats, statistics, message: 'Plik cat_facts.txt został wyczyszczony' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to clear file';
      res.status(500).json({ success: false, error: message });
    }
  });

  // GET /api/di/info - Expose DI architecture metadata for educational UI display
  app.get('/api/di/info', (req, res) => {
    res.json({
      architecture: 'Dependency Injection (Inversion of Control)',
      platform: 'Microsoft TypeScript / Node.js Engine',
      services: [
        {
          interface: 'ICatFactClient',
          implementation: 'CatFactClient',
          lifetime: 'Singleton',
          responsibility: 'HTTP requests to https://catfact.ninja/fact with resilience and error handling'
        },
        {
          interface: 'IFileStorageService',
          implementation: 'FileStorageService',
          lifetime: 'Singleton',
          responsibility: 'Thread-safe local file creation and UTF-8 appending to cat_facts.txt'
        },
        {
          interface: 'ICatFactService',
          implementation: 'CatFactService',
          lifetime: 'Singleton',
          responsibility: 'Application coordinator orchestrating fetch and write operations via Constructor Injection'
        }
      ]
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Cat Facts Collector running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
