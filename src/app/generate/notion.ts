// Pourquoi pas de "use server" ici ?
// Parce que ce fichier ne contient que des fonctions utilitaires, pas de Server Actions appelées depuis le Frontend.
// C'est action.ts qui fera le pont.

export async function notionApi(endpoint: string, method: string, body?: any) {
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
  if (!res.ok) throw new Error(`Notion API: ${data.message}`);
  return data;
}

// 🛡️ ANTI-CRASH EMOJI
export function safeEmoji(e: string | undefined, fallback: string): string {
  if (!e) return fallback;
  // Notion plante si on lui envoie un symbole texte (dingbat) comme emoji officiel.
  if (["✦", "✧", "❖", "▫️", "▪️", "·"].includes(e.trim())) return fallback;
  return e.trim();
}

// 🛡️ ANTI-CRASH BLOCKS (Le nettoyeur récursif)
function isValid(block: any) {
  return block && typeof block === "object" && block.type && block[block.type] !== undefined;
}

export function deepClean(blocks: any[]): any[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.filter(isValid).map((block) => {
    const copy = { ...block };
    if (copy.type === "column_list" && copy.column_list?.children) {
      copy.column_list.children = copy.column_list.children.filter(isValid).map((col: any) => {
        if (col.type === "column" && col.column?.children) {
          const cleaned = deepClean(col.column.children);
          return { ...col, column: { children: cleaned.length ? cleaned : [B.space()] } };
        }
        return col;
      });
      if (copy.column_list.children.length < 2) return B.space();
    }
    return copy;
  }).filter(isValid);
}

// Fonction d'ajout par lots de 100 blocs max (Limite de l'API Notion)
export async function appendBlocks(pageId: string, blocks: any[]) {
  const safe = deepClean(blocks);
  for (let i = 0; i < safe.length; i += 100) {
    await notionApi(`blocks/${pageId}/children`, "PATCH", { children: safe.slice(i, i + 100) });
  }
}

// 🎨 DESIGN SYSTEM (Nos constructeurs de blocs sécurisés)
const makeText = (t: string, c = "default", b = false) => [{ type: "text", text: { content: t || " " }, annotations: { color: c, bold: b } }];

export const B = {
  h2: (t: string) => ({ object: "block", type: "heading_2", heading_2: { rich_text: makeText(t) } }),
  h3: (t: string) => ({ object: "block", type: "heading_3", heading_3: { rich_text: makeText(t) } }),
  p: (t: string, color = "default") => ({ object: "block", type: "paragraph", paragraph: { rich_text: makeText(t, color) } }),
  quote: (t: string) => ({ object: "block", type: "quote", quote: { rich_text: makeText(t, "gray") } }),
  callout: (t: string, emoji: string, color = "gray_background", bold = false) => ({
    object: "block", type: "callout",
    callout: { rich_text: makeText(t, "default", bold), icon: { type: "emoji", emoji: safeEmoji(emoji, "⚡") }, color }
  }),
  divider: () => ({ object: "block", type: "divider", divider: {} }),
  space: () => ({ object: "block", type: "paragraph", paragraph: { rich_text: [] } }),
  linkDb: (id: string) => ({ object: "block", type: "link_to_page", link_to_page: { type: "database_id", database_id: id } }),
  linkPg: (id: string) => ({ object: "block", type: "link_to_page", link_to_page: { type: "page_id", page_id: id } }),
  cols: (columns: any[][]) => {
    const safeCols = columns.map(col => col.length > 0 ? col : [B.space()]);
    while (safeCols.length < 2) safeCols.push([B.space()]);
    return { object: "block", type: "column_list", column_list: { children: safeCols.map(bl => ({ object: "block", type: "column", column: { children: bl } })) } };
  },
};

// 🖼️ BANNIÈRES PREMIUM HARDCODÉES
export const PREMIUM_COVERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2560&auto=format&fit=crop",
];