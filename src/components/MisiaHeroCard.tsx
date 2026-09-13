import React, { useState } from 'react';
import { Sparkles, Heart, Award, BookmarkCheck, ArrowRight, Check, Info } from 'lucide-react';

interface MisiaHeroCardProps {
  onFetchFact?: (source: 'ninja' | 'tuxedo' | 'misia') => Promise<void>;
  onAppendMisiaFact?: () => Promise<void>;
  onAppendTuxedoFact?: () => Promise<void>;
  loading: boolean;
}

export const MisiaHeroCard: React.FC<MisiaHeroCardProps> = ({
  onFetchFact,
  onAppendMisiaFact,
  onAppendTuxedoFact,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState<'example' | 'tuxedo_facts' | 'bio'>('example');
  const [copiedFact, setCopiedFact] = useState(false);

  const handleAppendMisia = () => {
    if (onAppendMisiaFact) return onAppendMisiaFact();
    if (onFetchFact) return onFetchFact('misia');
    return Promise.resolve();
  };

  const handleAppendTuxedo = () => {
    if (onAppendTuxedoFact) return onAppendTuxedoFact();
    if (onFetchFact) return onFetchFact('tuxedo');
    return Promise.resolve();
  };

  const misiaExampleFact =
    "Misia is an elegant female tuxedo cat with a shiny obsidian-black coat, an immaculate white bib, four white mittens, and luminous emerald-green eyes. Like most tuxedo cats, she is remarkably clever, affectionate, and loves to supervise software developers.";

  const misiaExampleFactPl =
    "Misia to elegancka kotka o umaszczeniu tuxedo – ma lśniący czarny frak, śnieżnobiały gorset, cztery białe skarpetki i hipnotyzujące szmaragdowe oczy. Jest niezwykle bystra, czuła i uwielbia nadzorować pracę programistów.";

  const tuxedoFactsList = [
    {
      title: "Nie rasa, lecz umaszczenie",
      desc: "Koty tuxedo (ang. smoking) to nie odrębna rasa, lecz wzór dwubarwnego umaszczenia (bicolor / piebald) obecny m.in. u kotów europejskich, brytyjskich, Maine Coon i perskich."
    },
    {
      title: "Święte koty starożytnego Egiptu",
      desc: "Ponad 70% kotów uwiecznionych w egipskich grobowcach faraonów i na hieroglifach posiadało właśnie charakterystyczny wzór tuxedo z białym krawatem i łapkami."
    },
    {
      title: "Przyspieszony rozwój zmysłów",
      desc: "Kocięta tuxedo otwierają oczy średnio o 24 do 48 godzin wcześniej niż kocięta o jednolitej maści lub pręgowane."
    },
    {
      title: "Słynny kot Socks w Białym Domu",
      desc: "Kocur Socks o umaszczeniu tuxedo był oficjalnym pupilem prezydenckim w Białym Domu w latach 90., otrzymując tysiące listów od wielbicieli."
    },
    {
      title: "Ikony popkultury",
      desc: "Sylwester ze Zwariowanych Melodii, Kot w Butach, Kot Felix oraz Kot w Kapeluszu Dr. Seussa to wzorowe koty tuxedo."
    }
  ];

  const handleCopyExample = () => {
    navigator.clipboard.writeText(misiaExampleFact);
    setCopiedFact(true);
    setTimeout(() => setCopiedFact(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-2xl">
      {/* Tuxedo lapel decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-white/5 to-transparent pointer-events-none rounded-full blur-3xl"></div>
      
      {/* Top Tuxedo Header Bar */}
      <div className="px-6 py-4 bg-zinc-900/90 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Główna bohaterka aplikacji • Kot Tuxedo
          </span>
        </div>

        <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-xl border border-zinc-700/60 text-xs">
          <button
            id="tab-example-fact-btn"
            type="button"
            onClick={() => setActiveTab('example')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'example'
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Przykładowy fakt (Misia)
          </button>
          <button
            id="tab-tuxedo-facts-btn"
            type="button"
            onClick={() => setActiveTab('tuxedo_facts')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'tuxedo_facts'
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Ciekawostki o Tuxedo
          </button>
          <button
            id="tab-misia-bio-btn"
            type="button"
            onClick={() => setActiveTab('bio')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'bio'
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Profil Misi
          </button>
        </div>
      </div>

      {/* Main Tuxedo Card Body */}
      <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Misia Portrait Frame with Tuxedo styling */}
        <div className="lg:col-span-4 flex flex-col items-center text-center">
          <div className="relative group">
            {/* White "shirt/bib" outer ring and emerald glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-white via-zinc-400 to-emerald-500 opacity-40 group-hover:opacity-75 blur-sm transition duration-500"></div>
            
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-white/80 shadow-2xl bg-zinc-900">
              <img
                src="/misia_tuxedo_cat.jpg"
                alt="Misia the Tuxedo Cat"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 text-left">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  Misia 🐾
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  Kotka w garniturze (Tuxedo)
                </span>
              </div>
            </div>

            {/* Bowtie Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-zinc-950 px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-zinc-300 flex items-center gap-1.5 whitespace-nowrap">
              <span>🎀</span>
              <span>Biały gorset & skarpetki</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
              Oczy: <strong className="text-emerald-400">Szmaragdowe</strong>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
              Łapki: <strong className="text-white">Białe rękawiczki</strong>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
              Frak: <strong className="text-zinc-200">Lśniąca czerń</strong>
            </span>
          </div>
        </div>

        {/* Right: Tab Content (Example Fact, Tuxedo Facts, or Bio) */}
        <div className="lg:col-span-8">
          {activeTab === 'example' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Oficjalny przykładowy fakt o Misi (Example Fact)
              </div>

              {/* Crisp White Bib Card for high-contrast Tuxedo effect */}
              <div className="p-6 rounded-2xl bg-white text-zinc-900 shadow-xl border border-zinc-200 space-y-3 relative">
                <div className="absolute top-4 right-4 text-3xl select-none opacity-20 font-serif">
                  🐾
                </div>

                <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                  <span>Misia – ikoniczna kotka Tuxedo</span>
                  <span className="text-xs font-normal text-zinc-500 font-mono">
                    (Długość: {misiaExampleFact.length} znaków)
                  </span>
                </h3>

                <blockquote className="text-sm font-medium text-zinc-800 leading-relaxed italic border-l-4 border-zinc-900 pl-4 py-1">
                  "{misiaExampleFact}"
                </blockquote>

                <p className="text-xs text-zinc-600 pl-4 border-l-4 border-emerald-500/50">
                  {misiaExampleFactPl}
                </p>

                <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      id="copy-misia-example-btn"
                      type="button"
                      onClick={handleCopyExample}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedFact ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Skopiowano
                        </>
                      ) : (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5" /> Kopiuj treść
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    id="append-misia-fact-btn"
                    type="button"
                    disabled={loading}
                    onClick={handleAppendMisia}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-zinc-950 hover:bg-zinc-800 active:scale-95 disabled:opacity-50 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <span>Dopisz ten fakt o Misi do cat_facts.txt</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  Kliknięcie zapisze fakt w nowym wierszu pliku zgodnie z wymaganiem zadania.
                </span>
                <button
                  id="append-random-tuxedo-btn"
                  type="button"
                  disabled={loading}
                  onClick={handleAppendTuxedo}
                  className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 cursor-pointer"
                >
                  Losuj inny fakt o kotach Tuxedo →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tuxedo_facts' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Wszystko o kotach w smokingu (Tuxedo Cats)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Bicolour Piebald
                  </span>
                </h3>
                <button
                  id="append-tuxedo-trivia-btn"
                  type="button"
                  disabled={loading}
                  onClick={handleAppendTuxedo}
                  className="text-xs font-semibold px-3 py-1.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-lg transition-colors cursor-pointer"
                >
                  + Dopisuj losową ciekawostkę Tuxedo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {tuxedoFactsList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                      <span>🐾</span>
                      <h4>{item.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bio' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Misia</h3>
                    <p className="text-xs text-emerald-400 font-mono">
                      Chief Feline Officer (CFO) & Maskotka Tuxedo
                    </p>
                  </div>
                  <span className="text-2xl">🐱</span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Misia to rezolutna kotka o klasycznym fraku wieczorowym. Jej znakiem rozpoznawczym jest idealnie symetryczny biały krawat, cztery białe buciki oraz hipnotyzujące szmaragdowe spojrzenie. Uwielbia zasypiać przy klawiaturze i upewniać się, że każde wywołanie Dependency Injection przechodzi bez błędu.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800 text-xs">
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
                    <span className="text-zinc-500 text-[11px] block">Płeć:</span>
                    <span className="font-semibold text-zinc-200">Kotka (She)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
                    <span className="text-zinc-500 text-[11px] block">Ulubiona biblioteka:</span>
                    <span className="font-semibold text-emerald-400">Microsoft TypeScript</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
                    <span className="text-zinc-500 text-[11px] block">Plik docelowy:</span>
                    <span className="font-semibold text-amber-400 font-mono">cat_facts.txt</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
                    <span className="text-zinc-500 text-[11px] block">Status:</span>
                    <span className="font-semibold text-emerald-400">Aktywna & Zadowolona</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
