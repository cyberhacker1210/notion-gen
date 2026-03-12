"use client";

import { useState } from "react";
import { generateNotionTemplate } from "./action";

type StepStatus = { label: string; done: boolean };

export default function GeneratePage() {
  const [step, setStep] = useState<"input" | "generating" | "done">("input");
  const [prompt, setPrompt] = useState("");
  const [buildSteps, setBuildSteps] = useState<StepStatus[]>([]);
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (prompt.trim().length < 5) return;
    setError("");
    setStep("generating");

    setBuildSteps([
      { label: "L'IA analyse ton besoin et conçoit l'architecture...", done: false },
      { label: "Création des bases de données relationnelles...", done: false },
      { label: "Injection des données d'exemple...", done: false },
      { label: "Construction des sous-pages & templates...", done: false },
      { label: "Design du Dashboard avec layout 2 colonnes...", done: false },
      { label: "Finitions, KPIs et polish final...", done: false },
    ]);

    const progressInterval = setInterval(() => {
      setBuildSteps((prev) => {
        const next = [...prev];
        const first = next.findIndex((s) => !s.done);
        if (first !== -1 && first < next.length - 1) next[first].done = true;
        return next;
      });
    }, 7000);

    const response = await generateNotionTemplate(prompt);
    clearInterval(progressInterval);
    setBuildSteps((prev) => prev.map((s) => ({ ...s, done: true })));

    await new Promise((r) => setTimeout(r, 600));

    if (response.success && response.url) {
      setResultUrl(response.url);
      setStep("done");
    } else {
      setError(response.error || "Erreur lors de la génération. Réessaie !");
      setStep("input");
    }
  };

  const handleReset = () => {
    setStep("input");
    setPrompt("");
    setBuildSteps([]);
    setResultUrl("");
    setError("");
  };

  // ============================================
  // DONE
  // ============================================
  if (step === "done") {
    return (
      <section className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-lg w-full">
          <div className="bg-[#111] p-10 rounded-3xl border border-[#222] shadow-2xl text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">
              Ton système est prêt.
            </h1>
            <p className="text-neutral-500 text-sm mb-8">
              Bases de données relationnelles · Dashboard premium · Données d'exemple · Templates
            </p>
            <a
              href={resultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full bg-white text-black font-bold text-lg py-4 rounded-2xl hover:bg-neutral-200 transition-all shadow-lg hover:-translate-y-0.5"
            >
              Ouvrir dans Notion →
            </a>
            <button
              onClick={handleReset}
              className="mt-4 w-full py-3 rounded-2xl border border-[#333] text-neutral-500 hover:text-white hover:border-[#555] transition-all text-sm"
            >
              Générer un autre template
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ============================================
  // GENERATING
  // ============================================
  if (step === "generating") {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
        <div className="max-w-lg w-full">
          <div className="bg-[#111] p-10 rounded-3xl border border-[#222] shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center animate-pulse">
                <span className="text-3xl">⚡</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                Construction en cours...
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                L'IA conçoit ton système sur-mesure
              </p>
            </div>

            <div className="space-y-4">
              {buildSteps.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 transition-all duration-500 ${
                    s.done ? "opacity-40" : "opacity-100"
                  }`}
                >
                  {s.done ? (
                    <span className="text-emerald-400 text-lg flex-shrink-0">✓</span>
                  ) : (
                    <svg
                      className="animate-spin h-4 w-4 text-violet-400 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  <span
                    className={`text-sm ${
                      s.done ? "text-neutral-600 line-through" : "text-neutral-300"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <span className="text-xs text-neutral-600 bg-[#1a1a1a] px-4 py-2 rounded-full">
                ~45 secondes · Ne ferme pas la page
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ============================================
  // INPUT
  // ============================================
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="max-w-2xl w-full">
        <div className="bg-[#111] p-10 rounded-3xl border border-[#222] shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-3xl">⚡</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Notion Template Generator
            </h1>
            <p className="text-neutral-500 mt-2">
              Décris ton besoin. L'IA construit un système Notion complet et premium.
            </p>
          </div>

          {/* What you get */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: "🗄️", label: "3-6 Bases relationnelles" },
              { icon: "📊", label: "Dashboard avec KPIs" },
              { icon: "📄", label: "Sous-pages & Templates" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#1a1a1a] border border-[#252525] text-center"
              >
                <span className="text-xl block">{item.icon}</span>
                <p className="text-neutral-400 text-xs mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Examples */}
          <div className="mb-6">
            <p className="text-neutral-600 text-xs mb-3 uppercase tracking-wider font-medium">
              Exemples de prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Gestion d'élevage de reptiles",
                "Suivi de collection de vinyles",
                "Studio de tatouage freelance",
                "Entraînement marathon",
                "Gestion d'une micro-brasserie",
                "Suivi de lectures & book club",
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#252525] text-neutral-400 text-xs hover:border-violet-500/50 hover:text-violet-300 transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            className="w-full h-32 p-5 rounded-2xl bg-[#0a0a0a] border border-[#252525] text-white text-base focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none placeholder:text-neutral-600"
            placeholder="Décris précisément ton besoin, ta niche, ce que tu veux organiser..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={prompt.trim().length < 5}
            className="mt-6 w-full bg-white text-black font-bold text-lg py-4 rounded-2xl hover:bg-neutral-200 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-20 disabled:hover:translate-y-0 disabled:cursor-not-allowed active:translate-y-0"
          >
            Générer mon template →
          </button>

          <p className="mt-4 text-center text-xs text-neutral-600">
            Databases relationnelles · Rollups · KPIs · Données d'exemple · Layout pro
          </p>
        </div>
      </div>
    </section>
  );
}