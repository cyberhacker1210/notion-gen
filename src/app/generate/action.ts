"use server";

import { runArchitectAgent, runContentAgent, runUXAgent } from "./agents";
import { notionApi, appendBlocks, B, PREMIUM_COVERS, safeEmoji, deepClean } from "./notion";
import { DatabaseSchema, ContentData } from "./types";

// ================================================================
// SECURITÉ DES TYPES (Empêche l'IA de crasher l'API)
// ================================================================
function safeType(t: string) {
  const valid = ["rich_text", "number", "select", "multi_select", "checkbox", "date", "url", "email"];
  return valid.includes(t) ? t : "rich_text";
}

function buildRowProps(db: DatabaseSchema, item: any, relId?: string): any {
  const tc = db.title_column || "Name";
  const p: any = { [tc]: { title: [{ text: { content: String(item.title || "—") } }] } };

  if (item.values && db.columns) {
    for (const [k, v] of Object.entries(item.values)) {
      if (k === tc || k === db.relation_name || v == null || k === "undefined") continue;
      const col = db.columns.find(c => c.name === k);
      if (!col) continue;
      
      const st = safeType(col.type);
      try {
        if (st === "checkbox") p[k] = { checkbox: v === true || v === "true" };
        else if (st === "number") p[k] = { number: Number(v) || 0 };
        else if (st === "select") p[k] = { select: { name: String(v) } };
        else if (st === "multi_select") p[k] = { multi_select: (Array.isArray(v) ? v : [v]).map(x => ({ name: String(x) })) };
        else if (st === "date") p[k] = { date: { start: String(v).slice(0, 10) } };
        else if (st === "url" && String(v).startsWith("http")) p[k] = { url: String(v) };
        else p[k] = { rich_text: [{ text: { content: String(v) } }] };
      } catch {}
    }
  }
  if (db.relation_name && db.relation_name !== "undefined" && relId) {
    p[db.relation_name] = { relation: [{ id: relId }] };
  }
  return p;
}

// ================================================================
// LE CHEF D'ORCHESTRE (Main Generator)
// ================================================================
export async function generateNotionTemplate(prompt: string) {
  try {
    // 🧠 1. LE WORKFLOW AGENTIQUE
    console.log("🧠 Lancement de l'Architecte...");
    const schema = await runArchitectAgent(prompt);
    
    console.log("✍️ Lancement du Copywriter & Designer UX...");
    const [content, uxPlan] = await Promise.all([
      runContentAgent(prompt, schema),
      runUXAgent(prompt, schema)
    ]);

    const rootId = process.env.NOTION_PARENT_PAGE_ID!;
    const coverUrl = PREMIUM_COVERS[Math.floor(Math.random() * PREMIUM_COVERS.length)];

    // 🏗️ 2. CRÉATION DU DASHBOARD
    console.log("🏗️ Création de l'OS...");
    const dashboard = await notionApi("pages", "POST", {
      parent: { type: "page_id", page_id: rootId },
      icon: { type: "emoji", emoji: safeEmoji(uxPlan.system_emoji, "✦") },
      cover: { type: "external", external: { url: coverUrl } }, 
      properties: { title: { title: [{ text: { content: uxPlan.system_name || "Premium OS" } }] } },
    });
    const D = dashboard.id;

    // ⚙️ 3. CRÉATION DU MOTEUR (Le Backend)
    const backendPage = await notionApi("pages", "POST", {
      parent: { type: "page_id", page_id: D },
      icon: { type: "emoji", emoji: "⚙️" },
      properties: { title: { title: [{ text: { content: "System Backend (Databases)" } }] } },
      children: deepClean([B.callout("⚠️ DANGER ZONE : Tes bases sources sont ici. Ne les supprime pas. Utilise le Dashboard pour tes vues liées.", "🔒", "red_background", true)]),
    });

    const dbMap: Record<string, { dbId: string; rowIds: string[] }> = {};
    let coreDbTitle = schema[0]?.title || "Hub";

    // Construction des bases de données
    for (const db of schema) {
      if (db.is_core_hub) coreDbTitle = db.title;
      const props: any = { [db.title_column || "Name"]: { title: {} } };
      
      for (const col of db.columns) {
        if (!col.name || col.name === "undefined" || col.name === db.title_column) continue;
        
        const st = safeType(col.type);
        if (st === "select" || st === "multi_select") {
          props[col.name] = { [st]: { options: (col.options || []).map(o => ({ name: String(o) })) } };
        } else {
          props[col.name] = { [st]: {} };
        }
      }

      if (db.relation_name && db.relation_name !== "undefined" && db.relates_to && dbMap[db.relates_to]) {
        props[db.relation_name] = { relation: { database_id: dbMap[db.relates_to].dbId, single_property: {} } };
      }
      props["Archived"] = { checkbox: {} };

      const createdDb = await notionApi("databases", "POST", {
        parent: { type: "page_id", page_id: backendPage.id },
        title: [{ text: { content: db.title || "Database" } }],
        icon: { type: "emoji", emoji: safeEmoji(db.emoji, "❖") },
        properties: props, // is_inline retiré pour autoriser les liens dynamiques sur l'accueil
      });

      const rowIds: string[] = [];
      const rows = content[db.key] || [];
      const parentRowIds = db.relates_to ? dbMap[db.relates_to]?.rowIds : [];

      for (let i = 0; i < rows.length; i++) {
        const relId = parentRowIds?.length ? parentRowIds[i % parentRowIds.length] : undefined;
        try {
          const r = await notionApi("pages", "POST", {
            parent: { type: "database_id", database_id: createdDb.id },
            properties: buildRowProps(db, rows[i], relId),
          });
          rowIds.push(r.id);
        } catch (e) {}
      }
      dbMap[db.key] = { dbId: createdDb.id, rowIds };
    }

    // 🎨 4. ASSEMBLAGE DU FRONTEND (Dashboard Premium)
    console.log("🎨 Finitions UX...");
    
    const dbLinksCol: any[] = [B.h3("🗄️ Databases")];
    for (const db of schema) {
      if (dbMap[db.key]) { 
        dbLinksCol.push(B.linkDb(dbMap[db.key].dbId));
      }
    }

    const navCol: any[] = [B.h3("⚙️ System"), B.linkPg(backendPage.id)];
    if (uxPlan.quick_actions && Array.isArray(uxPlan.quick_actions)) {
      navCol.push(B.space(), B.h3("⚡ Actions"));
      uxPlan.quick_actions.forEach(a => {
        if (a.label) navCol.push(B.callout(a.label, safeEmoji(a.emoji, "📝"), "default"));
      });
    }

    await appendBlocks(D, [
      B.space(),
      B.callout(uxPlan.tagline || "Opérationnel.", safeEmoji(uxPlan.system_emoji, "✦"), "default", true),
      B.divider(),
      B.space(),
      B.h2(`✦ Active Workspace : ${coreDbTitle}`),
      B.callout(`SETUP PREMIUM : Tape /linked view juste en dessous, sélectionne "${coreDbTitle}" et choisis la vue "Board" ou "Gallery".`, "⚡", "blue_background", true),
      B.space(),
      B.divider(),
      B.cols([dbLinksCol, navCol]),
      B.space(),
    ]);

    console.log("✅ 🏆 SYSTÈME AGENTIQUE TERMINÉ !");
    return { success: true, url: `https://notion.so/${D.replace(/-/g, "")}` };

  } catch (error: any) {
    console.error("❌ Erreur Globale:", error);
    return { success: false, error: error.message };
  }
}