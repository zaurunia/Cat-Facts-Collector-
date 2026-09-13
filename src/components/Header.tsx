import React from 'react';
import { Cat, Terminal, GitBranch, Cpu, CheckCircle2, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenDiModal: () => void;
  onOpenDotnetModal: () => void;
  onOpenGitModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDiModal,
  onOpenDotnetModal,
  onOpenGitModal,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {/* Tuxedo Badge Avatar */}
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 border-2 border-white/20 flex items-center justify-center text-white shadow-md relative overflow-hidden group">
              <span className="text-xl">🐱</span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center text-[9px] text-white">
                ✓
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                Cat Facts Collector
                <span className="text-xs px-2 py-0.5 rounded-full bg-white text-zinc-950 font-bold tracking-normal shadow-xs flex items-center gap-1">
                  <span>🐾</span> Tuxedo Edition • Misia
                </span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Microsoft TypeScript
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              API <code className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">https://catfact.ninja/fact</code> → zapis do pliku <code className="text-emerald-300 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">cat_facts.txt</code>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="open-di-btn"
            type="button"
            onClick={onOpenDiModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            Dependency Injection
          </button>

          <button
            id="open-dotnet-btn"
            type="button"
            onClick={onOpenDotnetModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            Wersja C# / .NET 8
          </button>

          <button
            id="open-git-btn"
            type="button"
            onClick={onOpenGitModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            Git & Repo
          </button>
        </div>
      </div>
    </header>
  );
};
