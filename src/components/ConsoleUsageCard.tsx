import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export const ConsoleUsageCard: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="w-4 h-4 text-zinc-900" />
        <h3 className="text-sm font-bold text-zinc-950">
          Uruchomienie w trybie konsolowym (CLI)
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-mono font-bold">
          Wymóg: konsola / web
        </span>
      </div>

      <p className="text-xs text-zinc-600 mb-3.5 leading-relaxed">
        Aplikacja posiada gotowy skrypt CLI (<code className="font-mono text-zinc-900 bg-zinc-100 px-1 py-0.5 rounded">cli.ts</code>), który korzysta z tego samego kontenera Dependency Injection i dopisuje fakty do pliku <code className="font-mono text-zinc-900 bg-zinc-100 px-1 py-0.5 rounded">cat_facts.txt</code> z poziomu terminala:
      </p>

      <div className="space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between bg-zinc-950 text-white px-4 py-3 rounded-xl border border-zinc-800">
          <span className="truncate mr-2 text-emerald-400">$ npm run cli</span>
          <button
            id="copy-cli-cmd-1"
            type="button"
            onClick={() => copyText('npm run cli', 'cmd1')}
            className="text-zinc-400 hover:text-white shrink-0 cursor-pointer"
            title="Kopiuj polecenie"
          >
            {copied === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center justify-between bg-zinc-950 text-white px-4 py-3 rounded-xl border border-zinc-800">
          <span className="truncate mr-2 text-emerald-400">$ npx tsx cli.ts --count=3 --show</span>
          <button
            id="copy-cli-cmd-2"
            type="button"
            onClick={() => copyText('npx tsx cli.ts --count=3 --show', 'cmd2')}
            className="text-zinc-400 hover:text-white shrink-0 cursor-pointer"
            title="Kopiuj polecenie"
          >
            {copied === 'cmd2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
