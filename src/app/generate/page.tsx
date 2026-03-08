"use client";

import { useState } from "react";
import { generateNotionTemplate } from "./action";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultUrl, setResultUrl] = useState("");

  const handleGenerate = async () => {
    if (prompt.trim() === "") return;
    
    setIsLoading(true);
    setIsSubmitted(true);

    const response = await generateNotionTemplate(prompt);
    
    if (response.success && response.url) {
      // ✅ ON STOCKE L'URL RÉELLE
      setResultUrl(response.url); 
    } else {
      alert("Erreur lors de la génération. Réessaie.");
      setIsSubmitted(false); // On annule l'écran de succès
    }
    
    setIsLoading(false);
  };

  return (
    <section className="min-h-screen flex flex-col items-center bg-slate-50 p-6">
      
      <div className="w-full pt-12 pb-8">
        <h1 className="text-center font-extrabold text-3xl md:text-4xl text-slate-900 tracking-tight">
          Générateur de <span className="text-blue-600">Template</span>
        </h1>
      </div>

      <div className="my-auto w-full max-w-2xl flex flex-col gap-6">
        
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center space-y-6 bg-white p-12 rounded-3xl border border-slate-200 shadow-xl">
            {isLoading ? (
              <>
                <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-slate-800 font-bold text-2xl animate-pulse text-center">
                  L'IA analyse ta demande et construit ton Notion...
                </h2>
              </>
            ) : (
              <>
                <span className="text-6xl">🎉</span>
                <h2 className="text-green-600 font-bold text-2xl text-center">
                  C'est prêt !
                </h2>
                <a 
                  href={resultUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                  Ouvrir dans Notion
                </a>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl">
            <p className="text-slate-500 text-lg font-medium">
              Décris ce que tu veux gérer (ex: tes cours, tes clients, ta salle de sport...). Sois le plus précis possible.
            </p>
            
            <textarea
              className="w-full h-48 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-none"
              placeholder="Je suis un étudiant en école d'ingénieur. Je veux un dashboard pour tracker mes révisions, avec une base de données pour mes matières et une autre pour mes notes..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <button
              onClick={handleGenerate}
              disabled={prompt.length < 10}
              className="w-full bg-blue-600 text-white font-bold text-lg py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg disabled:cursor-not-allowed"
            >
              Générer mon espace de travail
            </button>
          </div>
        )}

      </div>
    </section>
  );
}