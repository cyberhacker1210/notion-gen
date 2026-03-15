"use client";

import { useState, useRef, useEffect } from "react";
import { chatWithArchitect, ChatMessage } from "./chat";
import { generateNotionTemplate } from "./action"; // Le Chef d'Orchestre qu'on a codé précédemment

export default function ArchitectChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  // Nouveaux états pour la phase de construction Notion
  const [isBuilding, setIsBuilding] = useState(false);
  const [notionUrl, setNotionUrl] = useState<string | null>(null);
  const [buildError, setBuildError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isBuilding, notionUrl]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMessage: ChatMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const res = await chatWithArchitect(messages, textToSend);

    if (res.success && res.message) {
      setMessages((prev) => [...prev, { role: "assistant", content: res.message! }]);
      if (res.isReadyToBuild) {
        setIsReady(true);
      }
    } else {
      setMessages((prev) => [...prev, { role: "assistant", content: "Oops... " + res.error }]);
    }
    
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  // ==========================================================================
  // LA MAGIE OPÈRE ICI : Connexion entre le Chat et le Constructeur Notion
  // ==========================================================================
  const handleBuild = async () => {
    setIsBuilding(true);
    setBuildError(null);

    // 1. On sérialise la conversation en un script lisible par l'IA Architecte
    const conversationScript = messages
      .map((m) => `${m.role === "user" ? "Client" : "Expert IA"} : ${m.content}`)
      .join("\n\n");

    // 2. On prépare le prompt ultime
    const finalPrompt = `Voici la retranscription exacte de la discussion avec le client. 
    Construis l'architecture de la base de données et le dashboard en respectant STRICTEMENT ce qui a été convenu ici :
    
    ${conversationScript}`;

    // 3. On lance les Agents (ça prend environ 10-20 secondes)
    const result = await generateNotionTemplate(finalPrompt);

    if (result.success && result.url) {
      setNotionUrl(result.url);
    } else {
      setBuildError(result.error || "Une erreur est survenue lors de la construction.");
    }

    setIsBuilding(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
          <span className="text-3xl">📐</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Notion Architect</h1>
        <p className="text-slate-500 mt-2">Discute avec l'IA. Elle construit ton système.</p>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[650px]">
        
        {/* ZONE DES MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <span className="text-5xl">👋</span>
              <p className="text-lg font-medium text-slate-700 max-w-md">
                Salut ! Je suis ton Architecte Notion. Pour quel type de projet as-tu besoin d'aide aujourd'hui ?
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["💼 CRM Freelance", "💰 Suivi de budget perso", "📚 Organisation Étudiante"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 text-[15px] leading-relaxed ${
                msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-br-none shadow-md" 
                  : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm flex gap-1">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ZONE D'INPUT & ACTIONS */}
        <div className="p-4 bg-white border-t border-slate-200">
          
          {/* ÉTAT 3 : Template généré ! */}
          {notionUrl ? (
            <div className="animate-in slide-in-from-bottom-4 text-center p-4 bg-green-50 border border-green-200 rounded-2xl">
              <span className="text-3xl block mb-2">🎉</span>
              <h3 className="font-bold text-green-800 text-lg mb-4">Ton système est prêt !</h3>
              <a 
                href={notionUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all"
              >
                Ouvrir dans Notion →
              </a>
            </div>
          ) : 
          
          /* ÉTAT 2 : En cours de construction */
          isBuilding ? (
            <div className="animate-in slide-in-from-bottom-4 text-center p-6 bg-slate-50 border border-slate-200 rounded-2xl">
               <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
               <h3 className="font-bold text-slate-800">Les Agents IA travaillent...</h3>
               <p className="text-sm text-slate-500 mt-1">Création des bases, injection des données, design du dashboard (~15s)</p>
            </div>
          ) : 
          
          /* ÉTAT 1 : Prêt à construire */
          isReady ? (
             <div className="animate-in slide-in-from-bottom-4">
               {buildError && (
                 <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                   {buildError}
                 </div>
               )}
               <button 
                  onClick={handleBuild}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                 ✨ CRÉER CE SYSTÈME DANS MON NOTION
               </button>
               <p className="text-xs text-center text-slate-400 mt-3">L'IA a toutes les informations nécessaires.</p>
             </div>
          ) : 
          
          /* ÉTAT 0 : Chat en cours */
          (
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tape ta réponse ici..."
                disabled={isTyping}
                className="w-full bg-slate-100 border-none rounded-2xl pl-4 pr-14 py-4 text-[15px] focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none h-14 overflow-hidden disabled:opacity-50"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                ↑
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}