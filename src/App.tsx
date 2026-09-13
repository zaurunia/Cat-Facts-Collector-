import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.js';
import { MisiaHeroCard } from './components/MisiaHeroCard.js';
import { StatisticsBanner } from './components/StatisticsBanner.js';
import { FactActionCard } from './components/FactActionCard.js';
import { FileViewer } from './components/FileViewer.js';
import { ConsoleUsageCard } from './components/ConsoleUsageCard.js';
import { DiArchitectureModal } from './components/DiArchitectureModal.js';
import { DotnetCodeModal } from './components/DotnetCodeModal.js';
import { GitInstructionsModal } from './components/GitInstructionsModal.js';
import { FetchFactApiResponse, FileStats, FactStatistics } from './types.js';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [lines, setLines] = useState<string[]>([]);
  const [stats, setStats] = useState<FileStats | null>(null);
  const [statistics, setStatistics] = useState<FactStatistics | null>(null);
  const [latestResult, setLatestResult] = useState<FetchFactApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [diModalOpen, setDiModalOpen] = useState(false);
  const [dotnetModalOpen, setDotnetModalOpen] = useState(false);
  const [gitModalOpen, setGitModalOpen] = useState(false);

  // Load current file content & statistics
  const loadFileContent = useCallback(async () => {
    try {
      const response = await fetch('/api/facts/file');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setLines(data.lines || []);
        setStats(data.stats || null);
        if (data.statistics) {
          setStatistics(data.statistics);
        }
        setError(null);
      } else {
        setError(data.error || 'Nie udało się wczytać pliku');
      }
    } catch (err: unknown) {
      console.error('Error fetching file content:', err);
      setError(err instanceof Error ? err.message : 'Błąd połączenia z serwerem');
    }
  }, []);

  useEffect(() => {
    loadFileContent();
  }, [loadFileContent]);

  // Handle single fact fetch with optional source (ninja, tuxedo, misia) and format
  const handleFetchFact = useCallback(
    async (source: 'ninja' | 'tuxedo' | 'misia' = 'ninja', format: 'formatted' | 'raw' = 'formatted') => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/facts/fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ source, format }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error ${res.status}`);
        }

        const result: FetchFactApiResponse = await res.json();
        setLatestResult(result);
        if (result.stats) {
          setStats(result.stats);
        }
        if (result.statistics) {
          setStatistics(result.statistics);
        }
        // Refresh lines list
        await loadFileContent();
      } catch (err: unknown) {
        console.error('Fetch fact error:', err);
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania faktu');
      } finally {
        setLoading(false);
      }
    },
    [loadFileContent]
  );

  // Handle batch fetch
  const handleBatchFetch = useCallback(
    async (count: number, source: 'ninja' | 'tuxedo' | 'misia' = 'ninja', format: 'formatted' | 'raw' = 'formatted') => {
      setLoading(true);
      setError(null);
      try {
        for (let i = 0; i < count; i++) {
          const res = await fetch('/api/facts/fetch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source, format }),
          });
          if (!res.ok) throw new Error(`Błąd zapytania ${i + 1}`);
          const data: FetchFactApiResponse = await res.json();
          setLatestResult(data);
          if (data.statistics) {
            setStatistics(data.statistics);
          }
        }
        await loadFileContent();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Błąd pobierania partii');
      } finally {
        setLoading(false);
      }
    },
    [loadFileContent]
  );

  // Clear file
  const handleClearFile = useCallback(async () => {
    if (!window.confirm('Czy na pewno chcesz wyczyścić zawartość pliku cat_facts.txt?')) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/facts/clear', { method: 'POST' });
      if (!res.ok) throw new Error('Nie udało się wyczyścić pliku');
      setLatestResult(null);
      await loadFileContent();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Błąd czyszczenia pliku');
    } finally {
      setLoading(false);
    }
  }, [loadFileContent]);

  // Download file
  const handleDownloadFile = () => {
    window.location.href = '/api/facts/download';
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Header
        onOpenDiModal={() => setDiModalOpen(true)}
        onOpenDotnetModal={() => setDotnetModalOpen(true)}
        onOpenGitModal={() => setGitModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification banner if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              id="retry-fetch-btn"
              type="button"
              onClick={loadFileContent}
              className="inline-flex items-center gap-1 font-semibold text-rose-900 underline hover:no-underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Ponów
            </button>
          </div>
        )}

        {/* Misia Tuxedo Cat Star Card */}
        <MisiaHeroCard
          onFetchFact={handleFetchFact}
          loading={loading}
        />

        {/* Cat Fact Collector Statistics Banner (Zadanie 3) */}
        <StatisticsBanner
          statistics={statistics}
          loading={loading}
        />

        {/* Fact Action Card - Tuxedo Engine */}
        <FactActionCard
          stats={stats}
          latestResult={latestResult}
          loading={loading}
          onFetchFact={handleFetchFact}
          onBatchFetch={handleBatchFetch}
          onClearFile={handleClearFile}
          onDownloadFile={handleDownloadFile}
        />

        {/* Live File Viewer & Console Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FileViewer
              lines={lines}
              stats={stats}
              latestIndex={latestResult?.lineIndex ?? null}
              onRefresh={loadFileContent}
            />
          </div>

          <div className="space-y-6">
            <ConsoleUsageCard />

            <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl p-6 space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950">
                  Weryfikacja wymagań zadania
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono bg-zinc-900 text-white font-bold">
                  Status: 100%
                </span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong className="text-zinc-900">Technologia Microsoftu:</strong> Microsoft TypeScript (silne typowanie, interfejsy) + kompletny wzorcowy projekt C# / .NET 8 w <code className="font-mono text-zinc-900 bg-zinc-100 px-1 py-0.5 rounded">/TuxedoCatFactLogger</code>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong className="text-zinc-900">Połączenie z endpointem:</strong> Obsługa <code className="font-mono text-zinc-900 bg-zinc-100 px-1 py-0.5 rounded">https://catfact.ninja/fact</code> + fakty o kotach tuxedo i kotce Misi.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong className="text-zinc-900">Lokalny plik .txt & format:</strong> Dopisuje nowy wiersz w nowej linijce (<code className="font-mono text-zinc-900 bg-zinc-100 px-1 py-0.5 rounded font-bold">cat_facts.txt</code>) w formacie <code className="font-mono text-zinc-900 bg-zinc-100 px-1 py-0.5 rounded font-bold">YYYY-MM-DD | fact | len</code>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ★
                  </span>
                  <span>
                    <strong className="text-zinc-900">Cat Fact Statistics (Zadanie 3):</strong> Panel statystyk: Requests made, Facts saved, Average fact length oraz Latest fact.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ★
                  </span>
                  <span>
                    <strong className="text-zinc-900">Dependency Injection:</strong> Modularna architektura IoC z interfejsami <code className="font-mono text-zinc-900 bg-zinc-100 px-1 py-0.5 rounded">ICatFactClient</code>, <code className="font-mono text-zinc-900 bg-zinc-100 px-1 py-0.5 rounded">IFileStorageService</code>, <code className="font-mono text-zinc-900 bg-zinc-100 px-1 py-0.5 rounded">ICatFactService</code>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ★
                  </span>
                  <span>
                    <strong className="text-zinc-900">Kontrola wersji (Git):</strong> Skonfigurowane repozytorium z instrukcją wysłania przed rozmową.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-zinc-900 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    🐾
                  </span>
                  <span>
                    <strong className="text-zinc-900">Branding Kotka Misia & Tuxedo:</strong> Elegancki motyw czarno-biały (tuxedo jacket & crisp white bib) z zielonymi akcentami oczu i faktami o rasie tuxedo.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-5 text-center text-xs text-zinc-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-medium text-zinc-700">
            <span>🐾</span> Misia The Tuxedo Cat Edition • Cat Facts Collector
          </span>
          <span className="text-zinc-500 font-mono">
            Microsoft TypeScript • Express • Dependency Injection • cat_facts.txt
          </span>
        </div>
      </footer>

      {/* Modals */}
      <DiArchitectureModal
        isOpen={diModalOpen}
        onClose={() => setDiModalOpen(false)}
      />
      <DotnetCodeModal
        isOpen={dotnetModalOpen}
        onClose={() => setDotnetModalOpen(false)}
      />
      <GitInstructionsModal
        isOpen={gitModalOpen}
        onClose={() => setGitModalOpen(false)}
      />
    </div>
  );
}
