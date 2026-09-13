import React from 'react';
import { X, Cpu, Check, Layers, Code, ArrowRight } from 'lucide-react';

interface DiArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiArchitectureModal: React.FC<DiArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Dependency Injection (Wstrzykiwanie zależności)
              </h2>
              <p className="text-xs text-indigo-700 font-medium">
                Spełnienie punktu: „Mile widziane: Użycie Dependency Injection”
              </p>
            </div>
          </div>
          <button
            id="close-di-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              1. Architektura IoC Container (Wzorzec Microsoft ServiceCollection)
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 mb-3">
              W projekcie zastosowano kontener IoC oparty o zasady SOLID. Serwisy komunikują się wyłącznie poprzez abstrakcyjne interfejsy, a instancje są wstrzykiwane przez konstruktor (Constructor Injection):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50">
                <span className="font-bold text-indigo-900 block font-mono text-[11px]">ICatFactClient</span>
                <span className="text-[11px] text-slate-500 block mt-1">Implementacja: CatFactClient</span>
                <p className="text-[11px] text-slate-600 mt-2">
                  Obsługuje odpytywanie endpointu HTTP <code className="font-mono text-indigo-700">/fact</code> z nagłówkami i obsługą błędów.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
                <span className="font-bold text-emerald-900 block font-mono text-[11px]">IFileStorageService</span>
                <span className="text-[11px] text-slate-500 block mt-1">Implementacja: FileStorageService</span>
                <p className="text-[11px] text-slate-600 mt-2">
                  Odpowiada za tworzenie pliku <code className="font-mono text-emerald-700">cat_facts.txt</code> i dopisywanie kolejnych linii (UTF-8).
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/50">
                <span className="font-bold text-purple-900 block font-mono text-[11px]">ICatFactService</span>
                <span className="text-[11px] text-slate-500 block mt-1">Implementacja: CatFactService</span>
                <p className="text-[11px] text-slate-600 mt-2">
                  Główny orkiestrator aplikacji, do którego wstrzykiwane są obie powyższe zależności.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-indigo-600" />
              2. Fragment kodu rejestracji i Constructor Injection
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
              <pre className="leading-relaxed">
{`// 1. Constructor Injection w CatFactService
export class CatFactService implements ICatFactService {
  constructor(
    private readonly catFactClient: ICatFactClient,
    private readonly fileStorageService: IFileStorageService
  ) {}

  async executeFactFetchAndAppend(): Promise<FetchResult> {
    const fact = await this.catFactClient.fetchRandomFact();
    await this.fileStorageService.appendLine(fact.fact);
    // ...
  }
}

// 2. Rejestracja w kontenerze IoC (server/di/container.ts)
container.registerSingleton<ICatFactService>(ServiceTokens.CatFactService, (c) => {
  const client = c.resolve<ICatFactClient>(ServiceTokens.CatFactClient);
  const storage = c.resolve<IFileStorageService>(ServiceTokens.FileStorageService);
  return new CatFactService(client, storage);
});`}
              </pre>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Korzyści z zastosowania Dependency Injection:
            </div>
            <p>• <strong>Testowalność (Unit Testing):</strong> Możliwość łatwego mockowania klienta HTTP lub zapisu pliku bez dotykania dysku czy sieci.</p>
            <p>• <strong>Wymienność implementacji:</strong> Zmiana zapisu z pliku .txt na bazę danych lub S3 wymaga jedynie podmienienia serwisu w kontenerze.</p>
            <p>• <strong>Czysty kod (Clean Architecture):</strong> Brak twardych zależności <code className="font-mono">new CatFactClient()</code> wewnątrz logiki biznesowej.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            id="di-modal-ok-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Rozumiem
          </button>
        </div>
      </div>
    </div>
  );
};
