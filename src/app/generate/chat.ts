"use server";

import OpenAI from "openai";

// On utilise le SDK OpenAI, mais on le branche sur les serveurs de GROQ
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Le type strict de notre conversation
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  success: boolean;
  message?: string;
  isReadyToBuild?: boolean; // Le déclencheur
  error?: string;
};

export async function chatWithArchitect(history: ChatMessage[], newMessage: string): Promise<ChatResponse> {
  try {
    // On ajoute le nouveau message à l'historique
    const fullHistory = [...history, { role: "user", content: newMessage }];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Le modèle ultra rapide de Groq
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `Tu es "Notion Architect", un expert amical et pédagogue. 
          Ton but est de guider l'utilisateur pour comprendre quel système Notion il veut créer.
          
          RÈGLES DU DIALOGUE :
          1. Pose UNE SEULE question à la fois.
          2. Ne parle pas de code, de JSON ou d'API. Parle de "Bases de données", "Propriétés", "Vues".
          3. Suggère des choses pour lui faciliter la vie (ex: "Je te propose de rajouter une colonne 'Statut', ça te va ?").
          4. Quand tu as compris les 3 à 5 bases de données nécessaires et leurs colonnes, fais un petit résumé final.
          
          RÈGLE TECHNIQUE ABSOLUE :
          Tu dois TOUJOURS répondre au format JSON strict.
          - "message" : Ta réponse en français à l'utilisateur.
          - "is_ready_to_build": false pendant la discussion. Met à true UNIQUEMENT quand tu as fait ton résumé final et que l'utilisateur a validé.

          Format JSON attendu :
          {
            "message": "...",
            "is_ready_to_build": false
          }`
        },
        // On injecte l'historique de la conversation
        ...(fullHistory as any)
      ],
      response_format: { type: "json_object" }
    });

    const aiContent = response.choices[0].message.content;
    if (!aiContent) throw new Error("Réponse vide");

    const parsed = JSON.parse(aiContent);

    return {
      success: true,
      message: parsed.message,
      isReadyToBuild: parsed.is_ready_to_build || false,
    };

  } catch (error: any) {
    console.error("❌ Erreur Chat :", error);
    return { success: false, error: "Désolé, j'ai eu un trou de mémoire. Peux-tu répéter ?" };
  }
}