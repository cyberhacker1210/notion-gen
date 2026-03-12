"use server";

import OpenAI from "openai";

// ================================================================
// INIT
// ================================================================
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ================================================================
// NOTION API
// ================================================================

async function notion(endpoint: string, method: string, body?: any) {
  const res = await fetch(`https://api.notion.com/v1/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`❌ [${endpoint}]`, JSON.stringify(data, null, 2));
    throw new Error(`Notion: ${data.message || endpoint}`);
  }
  return data;
}

async function append(pageId: string, blocks: any[]) {
  // Filtrer les null/undefined
  const safeBlocks = blocks.filter((b) => b != null);
  for (let i = 0; i < safeBlocks.length; i += 100) {
    await notion(`blocks/${pageId}/children`, "PATCH", {
      children: safeBlocks.slice(i, i + 100),
    });
  }
}

// ================================================================
// IMAGE LIBRARY (Sécurisées)
// ================================================================

const MAIN_COVERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2560&auto=format&fit=crop",
];

const NAV_IMAGES = [
  "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop",
];

const GALLERY_COVERS = [
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop",
];

// ================================================================
// BLOCK BUILDERS
// ================================================================

const B = {
  h2: (t: string) => ({ object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: t || " " } }] } }),
  h3: (t: string) => ({ object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: t || " " } }] } }),
  p: (t: string, color = "default") => ({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: t || " " }, annotations: { color } }] } }),
  quote: (t: string) => ({ object: "block", type: "quote", quote: { rich_text: [{ type: "text", text: { content: t || " " } }] } }),
  callout: (t: string, emoji: string, color = "gray_background", bold = false) => ({
    object: "block", type: "callout",
    callout: { rich_text: [{ type: "text", text: { content: t || " " }, annotations: { bold } }], icon: { type: "emoji", emoji: emoji || "💡" }, color }
  }),
  todo: (t: string, checked = false) => ({ object: "block", type: "to_do", to_do: { rich_text: [{ type: "text", text: { content: t || " " } }], checked } }),
  bullet: (t: string) => ({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [{ type: "text", text: { content: t || " " } }] } }),
  embed: (url: string) => {
    if (!url || !url.startsWith("http")) return B.p("[Widget]");
    return { object: "block", type: "embed", embed: { url } };
  },
  image: (url: string) => {
    if (!url || !url.startsWith("http")) return B.p("[Image]");
    return { object: "block", type: "image", image: { type: "external", external: { url } } };
  },
  divider: () => ({ object: "block", type: "divider", divider: {} }),
  space: () => ({ object: "block", type: "paragraph", paragraph: { rich_text: [] } }),
  cols: (columns: any[][]) => {
    const safeCols = columns.map(col => (col.length > 0 ? col : [B.p(" ")]));
    while (safeCols.length < 2) safeCols.push([B.p(" ")]);
    return {
      object: "block", type: "column_list",
      column_list: { children: safeCols.map(bl => ({ object: "block", type: "column", column: { children: bl } })) }
    };
  },
};

// ================================================================
// AI ARCHITECT
// ================================================================

interface Plan {
  system_name?: string;
  system_emoji?: string;
  cover_url?: string;
  tagline?: string;
  quote?: string;
  widgets?: {
    kpis?: Array<{ label: string; value: string }>;
    actions?: Array<{ label: string; emoji: string }>;
    todos?: string[];
    reminders?: string[];
  };
  visual_nav?: Array<{ label: string; emoji: string }>;
  databases?: Array<{
    key: string;
    title: string;
    emoji: string;
    description: string;
    title_column: string;
    columns: Array<{ name: string; type: string; options?: string[] }>;
    sample_data: Array<{ title: string; values: Record<string, any> }>;
    relates_to?: string;
    relation_name?: string;
  }>;
}

async function architect(prompt: string): Promise<Plan> {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `Tu es un architecte Notion. L'utilisateur te donne un sujet.
Conçois un système complet avec une structure JSON stricte.

RÈGLES IMPORTANTES :
1. "visual_nav" doit contenir EXACTEMENT 4 items (juste label et emoji).
2. 3 à 5 "databases" relationnelles.
3. "columns" : Types valides: "rich_text", "number", "select", "multi_select", "checkbox", "date", "url", "email". JAMAIS "title" dans columns.

JSON STRICT :
{
  "system_name": "...",
  "system_emoji": "...",
  "tagline": "...",
  "quote": "...",
  "widgets": {
    "kpis": [{"label": "MRR", "value": "1200€"}, {"label": "Clients", "value": "15"}],
    "actions": [{"label": "New Client", "emoji": "👤"}],
    "todos": ["Call John", "Send Invoice"],
    "reminders": ["Meeting at 4PM"]
  },
  "visual_nav": [
    {"label": "Factures", "emoji": "💶"}
  ],
  "databases": [
    {
      "key": "db_clients",
      "title": "Clients",
      "emoji": "👥",
      "description": "Base des clients",
      "title_column": "Nom Client",
      "columns": [{"name": "Statut", "type": "select", "options": ["Actif", "Inactif"]}],
      "sample_data": [{"title": "Acme Corp", "values": {"Statut": "Actif"}}],
      "relates_to": "",
      "relation_name": ""
    }
  ]
}`
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });
  
  return JSON.parse(res.choices[0].message.content as string) as Plan;
}

// ================================================================
// BUILD ROW PROPERTIES
// ================================================================

function vtype(t: string) { 
  return ["rich_text","number","select","multi_select","checkbox","date","url","email"].includes(t) ? t : "rich_text"; 
}

function buildRow(db: NonNullable<Plan["databases"]>[0], item: any, relId?: string): any {
  const tc = db.title_column || "Nom";
  const p: any = { [tc]: { title: [{ text: { content: String(item.title || "—") } }] } };

  if (item.values && db.columns) {
    for (const [k, v] of Object.entries(item.values)) {
      if (k === tc || k === db.relation_name || v == null) continue;
      const col = db.columns.find((c: any) => c.name === k);
      if (!col) continue;
      const t = vtype(col.type);
      try {
        if (t === "checkbox") p[k] = { checkbox: v === true || v === "true" };
        else if (t === "number") p[k] = { number: Number(v) || 0 };
        else if (t === "select") p[k] = { select: { name: String(v) } };
        else if (t === "multi_select") p[k] = { multi_select: (Array.isArray(v) ? v : [v]).map(x => ({ name: String(x) })) };
        else if (t === "date") p[k] = { date: { start: String(v).slice(0, 10) } };
        else if (t === "url") { if (String(v).startsWith("http")) p[k] = { url: String(v) }; }
        else p[k] = { rich_text: [{ text: { content: String(v) } }] };
      } catch {}
    }
  }

  if (db.relation_name && relId) {
    p[db.relation_name] = { relation: [{ id: relId }] };
  }
  return p;
}

// ================================================================
// MAIN GENERATOR
// ================================================================

export async function generateNotionTemplate(prompt: string) {
  try {
    console.log("🧠 1. IA : Architecture du système...");
    const plan = await architect(prompt);
    
    if (!plan.databases || plan.databases.length === 0) {
      throw new Error("L'IA n'a pas généré de bases de données.");
    }

    const rootId = process.env.NOTION_PARENT_PAGE_ID!;

    console.log("🏗️ 2. Création de la page principale...");
    
    const randomMainCover = MAIN_COVERS[Math.floor(Math.random() * MAIN_COVERS.length)];

    const dashboard = await notion("pages", "POST", {
      parent: { type: "page_id", page_id: rootId },
      icon: { type: "emoji", emoji: plan.system_emoji || "⚡" },
      cover: { type: "external", external: { url: randomMainCover } }, 
      properties: {
        title: { title: [{ text: { content: plan.system_name || "Workspace" } }] },
      },
    });
    const D = dashboard.id;

    console.log("🎨 3. Construction des Widgets (Top Row)...");
    
    // Ajout des types explicites ": any[]" ici pour corriger TypeScript
    const kpiCol: any[] = [B.h3("📊 Metrics")];
    for (const kpi of (plan.widgets?.kpis || []).slice(0, 4)) {
      kpiCol.push(B.callout(`${kpi.label}\n${kpi.value}`, "📈", "gray_background"));
    }
    
    const actionCol: any[] = [B.h3("⚡ Actions"), B.divider()];
    for (const action of (plan.widgets?.actions || []).slice(0, 4)) {
      actionCol.push(B.callout(action.label, action.emoji || "📌", "blue_background", true));
    }

    const todoCol: any[] = [B.h3("☑️ Mini-To-Do")];
    for (const td of (plan.widgets?.todos || []).slice(0, 5)) {
      todoCol.push(B.todo(td));
    }

    const reminderCol: any[] = [B.h3("📌 Reminders")];
    for (const rem of (plan.widgets?.reminders || []).slice(0, 5)) {
      reminderCol.push(B.bullet(rem));
    }

    await append(D, [
      B.space(),
      B.callout(plan.tagline || "Bienvenue.", plan.system_emoji || "✨", "blue_background", true),
      B.quote(plan.quote || "Focus & Discipline."),
      B.space(),
      B.cols([kpiCol, actionCol, todoCol, reminderCol]),
      B.divider()
    ]);

    console.log("🖼️ 4. Construction de la Navigation Visuelle...");
    const navItems = (plan.visual_nav || []).slice(0, 4);
    if (navItems.length > 0) {
      const navCols: any[][] = navItems.map((nav, i) => [
        B.image(NAV_IMAGES[i % NAV_IMAGES.length]),
        B.callout(nav.label, nav.emoji || "📂", "gray_background", true)
      ]);
      await append(D, [
        B.h2("🧭 Espaces"),
        B.cols(navCols),
        B.divider()
      ]);
    }

    console.log("🗄️ 5. Création des Bases de Données...");
    
    const dbMap: Record<string, { dbId: string; rowIds: string[] }> = {};
    const parentDbs = plan.databases.filter((d) => !d.relates_to);
    const childDbs = plan.databases.filter((d) => d.relates_to);

    let globalImageCounter = 0;

    async function createDb(db: NonNullable<Plan["databases"]>[0], parentInfo?: { dbId: string; rowIds: string[] }) {
      console.log(`  → DB : ${db.title}`);
      await append(D, [B.h2(`${db.emoji || "📋"} ${db.title}`), B.p(db.description || "", "gray")]);

      const props: any = { [db.title_column || "Nom"]: { title: {} } };
      for (const col of db.columns || []) {
        if (col.name === db.title_column || col.type === "title") continue;
        const ct = vtype(col.type);
        if ((ct === "select" || ct === "multi_select") && col.options?.length) {
          props[col.name] = { [ct]: { options: col.options.map((o: string) => ({ name: String(o) })) } };
        } else {
          props[col.name] = { [ct]: {} };
        }
      }

      if (db.relation_name && parentInfo) {
        props[db.relation_name] = { relation: { database_id: parentInfo.dbId, single_property: {} } };
      }

      const created = await notion("databases", "POST", {
        parent: { type: "page_id", page_id: D },
        title: [{ text: { content: db.title } }],
        icon: { type: "emoji", emoji: db.emoji || "📋" },
        is_inline: true,
        properties: props,
      });

      const rowIds: string[] = [];
      for (let i = 0; i < (db.sample_data || []).length; i++) {
        const item = db.sample_data[i];
        const relId = parentInfo?.rowIds?.length ? parentInfo.rowIds[i % parentInfo.rowIds.length] : undefined;
        
        const secureCover = GALLERY_COVERS[globalImageCounter % GALLERY_COVERS.length];
        globalImageCounter++;

        try {
          const r = await notion("pages", "POST", {
            parent: { type: "database_id", database_id: created.id },
            properties: buildRow(db, item, relId),
            cover: { type: "external", external: { url: secureCover } }
          });
          rowIds.push(r.id);
        } catch (e: any) {
          console.log(`    ⚠️ Erreur ligne: ${e.message?.slice(0,50)}`);
        }
      }
      
      await append(D, [B.divider()]);
      return { dbId: created.id, rowIds };
    }

    for (const db of parentDbs) {
      dbMap[db.key] = await createDb(db);
    }
    for (const db of childDbs) {
      dbMap[db.key] = await createDb(db, db.relates_to ? dbMap[db.relates_to] : undefined);
    }

    console.log("✅ 🏆 TEMPLATE GÉNÉRÉ SANS ERREURS !");
    return { success: true, url: `https://notion.so/${D.replace(/-/g, "")}` };

  } catch (error: any) {
    console.error("❌", error);
    return { success: false, error: error.message || String(error) };
  }
}