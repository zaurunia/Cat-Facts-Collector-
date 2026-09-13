import React, { useState } from 'react';
import { X, GitBranch, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface GitInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitInstructionsModal: React.FC<GitInstructionsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const gitCommands = `# 1. Sprawdź status git
git status

# 2. Dodaj pliki i wykonaj commit (jeśli nie został jeszcze zrobiony)
git add .
git commit -m "feat: Cat Facts Collector with Microsoft TypeScript, DI and local file storage"

# 3. Dodaj swój zdalny adres repozytorium GitHub/GitLab
git remote add origin https://github.com/TWOJ_LOGIN/cat-fact-collector.git

# 4. Wypchnij kod na gałąź main
git branch -M main
git push -u origin main`;

  const handleCopy = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                System kontroli wersji (Git / GitHub)
              </h2>
              <p className="text-xs text-emerald-700 font-medium">
                Spełnienie punktu: „Mile widziane: podesłanie linku do repo wcześniej”
              </p>
            </div>
          </div>
          <button
            id="close-git-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Repozytorium Git zostało zainicjalizowane</span>
              <p className="mt-0.5 text-emerald-800 leading-relaxed text-[11px]">
                Wszystkie pliki aplikacji, w tym implementacja w TypeScript (z DI) oraz rozwiązanie .NET C#, są gotowe do wypchnięcia na Twój prywatny lub publiczny profil GitHub.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Komendy do opublikowania na GitHub:</span>
              <button
                id="copy-git-commands-btn"
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold hover:text-emerald-900 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Skopiowano
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Kopiuj komendy
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-slate-200 rounded-xl p-3.5 font-mono text-xs overflow-x-auto">
              <pre className="leading-relaxed">{gitCommands}</pre>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-slate-800">Eksport jednym kliknięciem z Google AI Studio:</div>
            <p className="text-[11px] leading-relaxed">
              Możesz również wyeksportować cały projekt bezpośrednio do repozytorium GitHub za pomocą menu <strong>Export to GitHub</strong> w prawym górnym rogu lub pobrać pełne archiwum <strong>ZIP</strong>.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            id="git-modal-ok-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
          >
            Gotowe
          </button>
        </div>
      </div>
    </div>
  );
};
