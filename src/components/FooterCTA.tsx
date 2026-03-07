"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function FooterCTA() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormAction = async () => {
    if (email === "") return;
    setIsLoading(true);

    const { error } = await supabase.from("waitlist").insert([{ email: email }]);

    setIsLoading(false);

    if (error) {
      console.error("Erreur Supabase:", error);
      if (error.code === '23505') {
        alert("Tu es déjà sur la liste d'attente ! 😉");
      } else {
        alert("Oups, une erreur est survenue. Réessaie !");
      }
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <section id="waitlist" className="relative py-32 bg-slate-950 px-6 text-center overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto z-10">
        
        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8">
          Rejoins la révolution <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">No-Code</span>.
        </h2>
        
        <p className="text-xl text-slate-300 mb-16 max-w-2xl mx-auto leading-relaxed">
          L'accès à la Beta sera limité aux <span className="text-blue-400 font-bold border-b border-blue-400/30 pb-0.5">100 premiers inscrits</span>. Ne rate pas ta place pour générer ton premier système.
        </p>

        {isSubmitted ? (
          <div className="mx-auto max-w-md p-8 bg-green-500/10 border border-green-500/20 rounded-3xl shadow-[0_0_40px_-10px_rgba(34,197,94,0.2)] animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">Tu es sur la liste !</h3>
            <p className="text-green-200/80 text-lg">Surveille tes emails, on te contacte très vite.</p>
          </div>
        ) : (
          <form action={handleFormAction} className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Entrez votre meilleure adresse email..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-8 py-5 rounded-full bg-white/5 border border-white/10 text-white placeholder-slate-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
            />
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-5 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_-10px_rgba(37,99,235,0.6)] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center min-w-[220px]"
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Chargement...
                </span>
              ) : (
                "Je veux ma place"
              )}
            </button>
          </form>
        )}

        <div className="mt-32 pt-8 border-t border-white/10 text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-4">
          <p>© 2025 NotionGen.</p>
        </div>
        
      </div>
    </section>
  );
}