import OpenAI from "openai";
import { DatabaseSchema, ContentData, UXPlan } from "./types";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ============================================================================
// AGENT 1 : L'ARCHITECTE
// ============================================================================
export async function runArchitectAgent(prompt: string): Promise<DatabaseSchema[]> {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `Tu es un Data Architect Senior. Conçois le schéma de base de données (3 à 5 tables max).
        RÈGLE 1 : Types valides: "rich_text", "number", "select", "multi_select", "checkbox", "date", "url", "email".
        RÈGLE 2 : 1 base DOIT avoir "is_core_hub": true.
        RÈGLE 3 : Pour les emojis ("emoji"), n'utilise QUE des VRAIS EMOJIS standards (📁, 📊, ⚙️, 👥, ⬛). INTERDIT d'utiliser des symboles textes comme ✦, ✧ ou ❖ qui font planter l'API.
        JSON : { "databases": [ { "key": "db_1", "title": "...", "emoji": "📁", "description": "...", "title_column": "Nom", "columns": [...], "relates_to": "db_parent", "relation_name": "Lien" } ] }`
      },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });
  return JSON.parse(res.choices[0].message.content as string).databases;
}

// ============================================================================
// AGENT 2 : LE COPYWRITER
// ============================================================================
export async function runContentAgent(prompt: string, schema: DatabaseSchema[]): Promise<ContentData> {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `Tu es un Expert Métier. On te donne un schéma de DBs. 
        Génère 4 à 6 lignes de données d'exemple RÉALISTES et PREMIUM par base. 
        JSON : { "db_1": [ { "title": "Exemple 1", "values": { "Col1": "Val1" } } ] }`
      },
      { role: "user", content: `Sujet : ${prompt}\nSchéma : ${JSON.stringify(schema)}` }
    ],
    response_format: { type: "json_object" }
  });
  return JSON.parse(res.choices[0].message.content as string);
}

// ============================================================================
// AGENT 3 : LE DESIGNER UX
// ============================================================================
export async function runUXAgent(prompt: string, schema: DatabaseSchema[]): Promise<UXPlan> {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.6,
    messages: [
      {
        role: "system",
        content: `Tu es un UX Designer Notion Premium. Crée la structure visuelle du Dashboard.
        RÈGLES : Utilise des VRAIS EMOJIS pro et minimalistes (⬛, ⬜, ⚡, ⚙️, 📂, 📊). INTERDIT d'utiliser des symboles textes comme ✦ ou ❖.
        JSON : { "system_name": "...", "system_emoji": "⚡", "tagline": "...", "quote": "...", "kpis": [{"label":"...", "value":"..."}], "quick_actions": [{"label":"...", "emoji":"📝"}], "navigation": [{"label":"...", "emoji":"📂"}] }`
      },
      { role: "user", content: `Sujet : ${prompt}\nBases existantes : ${schema.map(s => s.title).join(", ")}` }
    ],
    response_format: { type: "json_object" }
  });
  return JSON.parse(res.choices[0].message.content as string);
}