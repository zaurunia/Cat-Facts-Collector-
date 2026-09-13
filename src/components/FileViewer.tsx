import React, { useState, useRef, useEffect } from 'react';
import { FileText, Copy, Check, Search, HardDrive, Hash, Calendar, ArrowDown } from 'lucide-react';
import { FileStats } from '../types.js';

interface FileViewerProps {
  lines: string[];
  stats: FileStats | null;
  latestIndex: number | null;
  onRefresh: () => Promise<void>;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  lines,
  stats,
  latestIndex,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rawMode, setRawMode] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedLine, setCopiedLine] = useState<number | null>(null);
  const listContainerRef = useRef<HTMLDivElement | null>(null);

  const parseLine = (line: string) => {
    const match = line.match(/^(\d{4}-\d{2}-\d{2})\s*\|\s*(.+)\s*\|\s*(\d+)$/);
    if (match) {
      return {
        isFormatted: true,
        date: match[1],
        fact: match[2].trim(),
        length: match[3],
      };
    }
    return {
      isFormatted: false,
      date: null,
      fact: line,
      length: null,
    };
  };

  const filteredLines = lines
    .map((line, originalIndex) => ({ line, originalIndex: originalIndex + 1 }))
    .filter((item) => item.line.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCopyAll = () => {
    if (lines.length === 0) return;
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyLine = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedLine(index);
    setTimeout(() => setCopiedLine(null), 1500);
  };

  const scrollToBottom = () => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTo({
        top: listContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    // Auto scroll down slightly on new items
    if (latestIndex && listContainerRef.current) {
      listContainerRef.current.scrollTo({
        top: listContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [lines.length, latestIndex]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
      {/* Top File Meta Bar - Tuxedo Jacket Black */}
      <div className="p-4 sm:p-5 bg-zinc-950 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-bold shadow-md">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm tracking-wide text-white">
                cat_facts.txt
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 font-mono border border-zinc-700">
                UTF-8 • Local Storage
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-md font-mono" title={stats?.filePath}>
              {stats?.filePath || './cat_facts.txt'}
            </p>
          </div>
        </div>

        {/* Stats badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono">
            <Hash className="w-3.5 h-3.5 text-emerald-400" />
            <span>{stats?.lineCount ?? lines.length} wierszy</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatBytes(stats?.sizeBytes ?? 0)}</span>
          </div>

          {stats?.lastModified && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>{new Date(stats.lastModified).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action and Search Toolbar */}
      <div className="p-3 bg-zinc-100/90 border-b border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-facts-input"
            type="text"
            placeholder="Szukaj w pliku cat_facts.txt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 shadow-2xs"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between w-full sm:w-auto gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-white p-0.5 rounded-xl border border-zinc-300 text-[11px] font-sans">
            <button
              type="button"
              onClick={() => setRawMode(false)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                !rawMode
                  ? 'bg-zinc-950 text-white font-bold'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Format
            </button>
            <button
              type="button"
              onClick={() => setRawMode(true)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                rawMode
                  ? 'bg-zinc-950 text-white font-bold'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Surowy (.txt)
            </button>
          </div>

          {lines.length > 0 && (
            <button
              id="scroll-bottom-btn"
              type="button"
              onClick={scrollToBottom}
              className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-950 px-2.5 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
              title="Przewiń na sam dół"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              Na dół
            </button>
          )}

          <button
            id="copy-all-file-btn"
            type="button"
            onClick={handleCopyAll}
            disabled={lines.length === 0}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-zinc-950 bg-white hover:bg-zinc-50 border border-zinc-300 px-3.5 py-1.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Skopiowano cały plik
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                Kopiuj całość
              </>
            )}
          </button>
        </div>
      </div>

      {/* File Content Area - Crisp White Bib Interior */}
      <div
        ref={listContainerRef}
        className="max-h-[460px] overflow-y-auto font-mono text-xs divide-y divide-zinc-100 bg-white"
      >
        {lines.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">Plik cat_facts.txt jest jeszcze pusty</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
              Kliknij przycisk <span className="font-bold text-zinc-950">„Wyślij request i dopisz wiersz”</span> lub wstaw fakt o Misi, aby utworzyć zawartość pliku.
            </p>
          </div>
        ) : filteredLines.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">
            Brak wyników dla zapytania „{searchQuery}”.
          </div>
        ) : (
          filteredLines.map(({ line, originalIndex }) => {
            const isJustAppended = latestIndex === originalIndex;
            const parsed = parseLine(line);

            return (
              <div
                key={originalIndex}
                className={`group flex items-start gap-3 p-3.5 transition-colors ${
                  isJustAppended
                    ? 'bg-emerald-50/80 font-medium border-l-4 border-emerald-500'
                    : 'hover:bg-zinc-50'
                }`}
              >
                {/* Line number */}
                <div className="w-10 shrink-0 text-right select-none text-zinc-400 group-hover:text-zinc-600 font-mono text-[11px] pt-0.5">
                  {originalIndex}
                </div>

                {/* Line text */}
                <div className="flex-1 text-zinc-800 leading-relaxed break-words font-sans text-xs">
                  {rawMode || !parsed.isFormatted ? (
                    <div className="flex items-start gap-1.5 font-mono text-xs">
                      {isJustAppended && (
                        <span className="text-emerald-600 text-xs select-none shrink-0" title="Nowy wpis">
                          🐾
                        </span>
                      )}
                      <span>{line}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {isJustAppended && (
                          <span className="text-emerald-600 text-xs select-none shrink-0" title="Nowy wpis">
                            🐾
                          </span>
                        )}
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200 shrink-0 select-none">
                          {parsed.date}
                        </span>
                        <span className="text-zinc-900 font-medium">{parsed.fact}</span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0 self-end sm:self-auto select-none">
                        {parsed.length} zn.
                      </span>
                    </div>
                  )}
                </div>

                {/* Copy line button */}
                <button
                  id={`copy-line-${originalIndex}-btn`}
                  type="button"
                  onClick={() => handleCopyLine(line, originalIndex)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-zinc-900 rounded transition-opacity cursor-pointer"
                  title="Kopiuj ten wiersz"
                >
                  {copiedLine === originalIndex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer information */}
      <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span>🐾</span> Format zapisu: 1 wiersz na request (LF / \n)
        </span>
        <span className="font-mono">
          Wyświetlono {filteredLines.length} z {lines.length} wierszy
        </span>
      </div>
    </div>
  );
};
