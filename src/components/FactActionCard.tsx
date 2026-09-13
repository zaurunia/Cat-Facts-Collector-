import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCw, Download, Trash2, Zap, Clock, Sparkles, Check, Globe, Cat, Award } from 'lucide-react';
import { FetchFactApiResponse, FileStats } from '../types.js';

interface FactActionCardProps {
  stats: FileStats | null;
  latestResult: FetchFactApiResponse | null;
  loading: boolean;
  onFetchFact: (source?: 'ninja' | 'tuxedo' | 'misia', format?: 'formatted' | 'raw') => Promise<void>;
  onBatchFetch: (count: number, source?: 'ninja' | 'tuxedo' | 'misia', format?: 'formatted' | 'raw') => Promise<void>;
  onClearFile: () => Promise<void>;
  onDownloadFile: () => void;
}

export const FactActionCard: React.FC<FactActionCardProps> = ({
  stats,
  latestResult,
  loading,
  onFetchFact,
  onBatchFetch,
  onClearFile,
  onDownloadFile,
}) => {
  const [selectedSource, setSelectedSource] = useState<'ninja' | 'tuxedo' | 'misia'>('ninja');
  const [selectedFormat, setSelectedFormat] = useState<'formatted' | 'raw'>('formatted');
  const [autoFetchEnabled, setAutoFetchEnabled] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(5);
  const [countdown, setCountdown] = useState(5);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!autoFetchEnabled) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCountdown(intervalSeconds);
      return;
    }

    setCountdown(intervalSeconds);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onFetchFact(selectedSource, selectedFormat);
          return intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [autoFetchEnabled, intervalSeconds, onFetchFact, selectedSource, selectedFormat]);

  const copyLatestFact = () => {
    if (!latestResult?.fact.fact) return;
    navigator.clipboard.writeText(latestResult.fact.fact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xl p-5 sm:p-7 relative overflow-hidden">
      {/* Decorative top accent line with emerald dot */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-zinc-900 text-white flex items-center gap-1">
              <span>🐾</span> Zadanie 1 & 2 • Tuxedo Engine
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              Dependency Injection Enabled
            </span>
          </div>
          <h2 className="text-xl font-black text-zinc-950 mt-1.5 tracking-tight">
            Pobieranie faktów z API & Zapis do pliku
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Wysyła żądanie do endpointu <span className="font-mono text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">catfact.ninja/fact</span> i dopisuje nowy wiersz w nowej linijce do <span className="font-mono text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 font-bold">cat_facts.txt</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="download-file-btn"
            type="button"
            onClick={onDownloadFile}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Pobierz plik cat_facts.txt"
          >
            <Download className="w-3.5 h-3.5 text-zinc-700" />
            Pobierz .txt
          </button>
          <button
            id="clear-file-btn"
            type="button"
            onClick={onClearFile}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
            title="Wyczyść zawartość pliku cat_facts.txt"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            Wyczyść
          </button>
        </div>
      </div>

      {/* Source & Format selector bar */}
      <div className="mt-5 p-3 rounded-2xl bg-zinc-100/80 border border-zinc-200/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Źródło pobieranego faktu:</span>
          <div className="flex flex-wrap gap-1.5 ml-1">
            <button
              id="source-ninja-btn"
              type="button"
              onClick={() => setSelectedSource('ninja')}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedSource === 'ninja'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>catfact.ninja (Oficjalne API)</span>
            </button>

            <button
              id="source-tuxedo-btn"
              type="button"
              onClick={() => setSelectedSource('tuxedo')}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedSource === 'tuxedo'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
              }`}
            >
              <Cat className="w-3.5 h-3.5 text-emerald-400" />
              <span>Koty Tuxedo</span>
            </button>

            <button
              id="source-misia-btn"
              type="button"
              onClick={() => setSelectedSource('misia')}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedSource === 'misia'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Misia (Mascot)</span>
            </button>
          </div>
        </div>

        {/* Row Format Selector (Zadanie 3 requirement) */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-500 font-medium">Format wiersza:</span>
          <div className="flex items-center bg-white p-1 rounded-xl border border-zinc-200 font-mono text-[11px]">
            <button
              id="format-structured-btn"
              type="button"
              onClick={() => setSelectedFormat('formatted')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedFormat === 'formatted'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
              title="Format z Zadania 3: YYYY-MM-DD | fact | length"
            >
              Data | Fakt | Długość
            </button>
            <button
              id="format-raw-btn"
              type="button"
              onClick={() => setSelectedFormat('raw')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedFormat === 'raw'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
              title="Tylko treść faktu"
            >
              Tylko treść
            </button>
          </div>
        </div>
      </div>

      {/* Main trigger controls */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Big Fetch Button (Tuxedo Black Jacket Style) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4 bg-zinc-950 text-white p-5 sm:p-6 rounded-2xl border border-zinc-800 shadow-md">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Format: <strong className="text-white font-mono">{selectedFormat === 'formatted' ? 'YYYY-MM-DD | fact | len' : 'raw text'}</strong>
              </span>
              <span className="font-mono text-emerald-400 font-semibold">1 klik = +1 linijka w pliku</span>
            </div>

            <button
              id="fetch-fact-btn"
              type="button"
              disabled={loading}
              onClick={() => onFetchFact(selectedSource, selectedFormat)}
              className="w-full py-4 px-6 rounded-xl text-base font-bold text-zinc-950 bg-white hover:bg-zinc-100 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-zinc-300"
            >
              {loading ? (
                <>
                  <RotateCw className="w-5 h-5 animate-spin text-zinc-900" />
                  <span>Pobieranie & Zapisywanie do .txt...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current text-zinc-950" />
                  <span>Wyślij request i dopisz wiersz do pliku</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-800 text-xs">
            <span className="text-zinc-400 font-medium">Szybkie serie requestów:</span>
            <div className="flex items-center gap-2">
              <button
                id="batch-fetch-3-btn"
                type="button"
                disabled={loading}
                onClick={() => onBatchFetch(3, selectedSource, selectedFormat)}
                className="px-3 py-1.5 font-semibold bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 rounded-lg transition-colors cursor-pointer text-xs"
              >
                +3 wiersze
              </button>
              <button
                id="batch-fetch-5-btn"
                type="button"
                disabled={loading}
                onClick={() => onBatchFetch(5, selectedSource, selectedFormat)}
                className="px-3 py-1.5 font-semibold bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 rounded-lg transition-colors cursor-pointer text-xs"
              >
                +5 wierszy
              </button>
            </div>
          </div>
        </div>

        {/* Auto-runner controls (Crisp White Bib Style) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50 p-5 sm:p-6 rounded-2xl border border-zinc-200">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-700" />
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                  Automatyczny odpytywacz
                </span>
              </div>
              {autoFetchEnabled && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Za {countdown}s
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
              Cykliczne wysyłanie żądania i dopisywanie kolejnych wierszy do pliku <code className="font-mono text-zinc-900">cat_facts.txt</code>.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="interval-select" className="text-zinc-700 font-semibold">
                Częstotliwość requestu:
              </label>
              <select
                id="interval-select"
                value={intervalSeconds}
                onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                disabled={autoFetchEnabled}
                className="text-xs font-semibold text-zinc-900 bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 shadow-2xs"
              >
                <option value={3}>Co 3 sekundy</option>
                <option value={5}>Co 5 sekund</option>
                <option value={10}>Co 10 sekund</option>
              </select>
            </div>

            <button
              id="toggle-autofetch-btn"
              type="button"
              onClick={() => setAutoFetchEnabled(!autoFetchEnabled)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                autoFetchEnabled
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-zinc-950 text-white hover:bg-zinc-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              {autoFetchEnabled ? 'Zatrzymaj automatyczne pobieranie' : 'Włącz automatyczne pobieranie'}
            </button>
          </div>
        </div>
      </div>

      {/* Latest fetch callout (Sleek Tuxedo Callout Card) */}
      {latestResult && latestResult.success && (
        <div className="mt-5 p-5 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-md">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ostatnio dopisany wiersz #{latestResult.lineIndex}:</span>
              {latestResult.source && (
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono bg-zinc-800 text-emerald-300 border border-zinc-700">
                  {latestResult.source}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-mono">
                {latestResult.fact.length} zn.
              </span>
              <button
                id="copy-latest-fact-btn"
                type="button"
                onClick={copyLatestFact}
                className="text-white hover:text-emerald-300 text-xs font-semibold flex items-center gap-1 cursor-pointer bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Skopiowano
                  </>
                ) : (
                  'Kopiuj'
                )}
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-zinc-100 italic leading-relaxed pl-3 border-l-2 border-emerald-400">
            "{latestResult.fact.fact}"
          </p>
        </div>
      )}
    </div>
  );
};
