import React, { useState } from 'react';
import { BarChart3, Terminal, Copy, Check, Sparkles, TrendingUp, Hash, FileText, ArrowRight } from 'lucide-react';
import { FactStatistics } from '../types.js';

interface StatisticsBannerProps {
  statistics: FactStatistics | null;
  loading: boolean;
}

export const StatisticsBanner: React.FC<StatisticsBannerProps> = ({ statistics, loading }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'ascii'>('cards');
  const [copiedAscii, setCopiedAscii] = useState(false);

  const stats = statistics || {
    requestsMade: 0,
    factsSaved: 0,
    averageFactLength: 0,
    shortestFactLength: 0,
    longestFactLength: 0,
    latestFact: null,
    latestFactLength: 0,
  };

  const asciiSummary = `=== Cat Fact Collector ===

Requests made: ${stats.requestsMade}
Facts saved: ${stats.factsSaved}
Average fact length: ${stats.averageFactLength} characters

Latest fact:
${stats.latestFact || 'Brak pobranych faktów.'}`;

  const copyAsciiText = () => {
    navigator.clipboard.writeText(asciiSummary);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-zinc-950 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-black shadow-md">
            <BarChart3 className="w-5 h-5 text-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Cat Fact API + Statistics
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 border border-zinc-700 font-bold">
                Live Aggregation
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Branding: <strong className="text-white">Tuxedo Cat Fact Logger</strong> • Obliczenia w locie dla pliku <code className="text-emerald-300 font-mono">cat_facts.txt</code>
            </p>
          </div>
        </div>

        {/* View mode toggle: Dashboard Cards vs Console ASCII */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            id="view-cards-toggle-btn"
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-zinc-950 shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Karty statystyk</span>
          </button>
          <button
            id="view-ascii-toggle-btn"
            type="button"
            onClick={() => setViewMode('ascii')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'ascii'
                ? 'bg-white text-zinc-950 shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Format konsolowy (===)</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'cards' ? (
        <div className="p-5 sm:p-7 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metric 1: Requests made */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                <span>Wykonane requesty HTTP</span>
                <span className="p-1 rounded-md bg-zinc-200 text-zinc-700">GET</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-zinc-950 font-mono tracking-tight">
                  {stats.requestsMade}
                </span>
                <span className="text-xs text-zinc-500 font-medium">żądań do API</span>
              </div>
              <div className="mt-2 text-[11px] text-zinc-500 font-mono">
                Requests made: {stats.requestsMade}
              </div>
            </div>

            {/* Metric 2: Facts saved */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                <span>Zapisane fakty w pliku</span>
                <FileText className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono tracking-tight">
                  {stats.factsSaved}
                </span>
                <span className="text-xs text-zinc-500 font-medium">wierszy w cat_facts.txt</span>
              </div>
              <div className="mt-2 text-[11px] text-zinc-500 font-mono">
                Facts saved: {stats.factsSaved}
              </div>
            </div>

            {/* Metric 3: Average fact length */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                <span>Średnia długość faktu</span>
                <Hash className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-zinc-950 font-mono tracking-tight">
                  {stats.averageFactLength}
                </span>
                <span className="text-xs text-zinc-500 font-medium">znaków (chars)</span>
              </div>
              <div className="mt-2 text-[11px] text-zinc-500 font-mono">
                Average fact length: {stats.averageFactLength} characters
              </div>
            </div>
          </div>

          {/* Latest Fact Section (prominently styled) */}
          <div className="p-5 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-md">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Latest fact
                </span>
              </div>
              {stats.latestFactLength ? (
                <span className="text-xs text-zinc-400 font-mono">
                  Długość: <strong className="text-white">{stats.latestFactLength}</strong> znaków
                </span>
              ) : null}
            </div>

            <div className="mt-3.5">
              {stats.latestFact ? (
                <p className="text-sm sm:text-base text-zinc-100 font-medium leading-relaxed italic pl-3.5 border-l-2 border-emerald-400">
                  "{stats.latestFact}"
                </p>
              ) : (
                <p className="text-xs text-zinc-400 italic">
                  Kliknij przycisk „Wyślij request i dopisz wiersz”, aby pobrać pierwszy fakt i zobaczyć statystyki.
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span>🐾</span> Zakres długości w pliku: min. <strong className="text-white font-mono">{stats.shortestFactLength}</strong> zn. — max. <strong className="text-white font-mono">{stats.longestFactLength}</strong> zn.
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">
                System.Text.Json + LINQ stats
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Console ASCII View as specified in Option 3 */
        <div className="p-5 sm:p-7 bg-zinc-900 text-white">
          <div className="flex items-center justify-between mb-3 text-xs text-zinc-400">
            <span className="font-mono">Podgląd formatu konsolowego z zadania:</span>
            <button
              id="copy-ascii-summary-btn"
              type="button"
              onClick={copyAsciiText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold cursor-pointer border border-zinc-700 transition-colors"
            >
              {copiedAscii ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Skopiowano</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Kopiuj ten tekst</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-5 rounded-2xl bg-zinc-950 font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed border border-zinc-800 whitespace-pre-wrap selection:bg-emerald-500 selection:text-black">
{asciiSummary}
          </pre>

          <p className="mt-3 text-xs text-zinc-400">
            Ten sam blok tekstowy jest generowany w konsoli C# (.NET 8) oraz w skrypcie konsolowym TypeScript (<code className="text-white">npm run cli</code>).
          </p>
        </div>
      )}
    </div>
  );
};
