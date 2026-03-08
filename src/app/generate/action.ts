"use server";

import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function fetchNotion(endpoint: string, method: string, body: any) {
  const res = await fetch(`https://api.notion.com/v1/${endpoint}`, {
    method,
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`❌ Erreur Notion sur ${endpoint}:`, JSON.stringify(data, null, 2));
    throw new Error(`Notion API Error on ${endpoint}`);
  }
  return data;
}

function getValidType(aiType: string) {
  const validTypes = ["rich_text", "number", "select", "checkbox", "date", "url", "email", "phone_number"];
  return validTypes.includes(aiType) ? aiType : "rich_text";
}

async function appendBlocks(pageId: string, blocks: any[]) {
  return fetchNotion(`blocks/${pageId}/children`, "PATCH", { children: blocks });
}

export async function generateNotionTemplate(prompt: string) {
  try {
    console.log("1. 🧠 Conception du Système Ultime...");

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Tu es un créateur de templates Notion premium vendus à 150€.
          Conçois un ÉCOSYSTÈME professionnel avec 3 bases de données dont 2 connectées.
          
          JSON STRICT :
          {
            "nom_systeme": "Nom premium (ex: Content Agency OS)",
            "emoji": "Un emoji",
            "pitch": "Phrase d'accroche percutante (1 ligne)",
            "methodologie": "Explication de ta méthodologie (2-3 phrases)",
            "citation": "Citation inspirante liée au thème",
            "guide": "Guide d'utilisation DÉTAILLÉ en 4-5 paragraphes. Explique étape par étape comment utiliser chaque espace au quotidien.",
            "astuces": ["Astuce pro 1", "Astuce pro 2", "Astuce pro 3", "Astuce pro 4"],
            "quetes": [
              "Lis le Mode d'Emploi en entier",
              "Transforme la base principale en vue Kanban",
              "Crée ta première vraie entrée",
              "Ajoute une vue Calendrier sur la base secondaire",
              "Personnalise les options de la colonne Statut",
              "Invite un collaborateur sur cet espace"
            ],
            "db_principale": {
              "titre": "Nom de la DB",
              "emoji": "📊",
              "intro": "Phrase d'intro pour cette section",
              "col_titre": "Nom colonne titre",
              "colonnes": [
                { "nom": "Statut", "type_notion": "select" },
                { "nom": "Budget", "type_notion": "number" }
              ],
              "donnees": [
                { "titre": "Exemple réaliste 1", "resume": "Description détaillée de cet élément en 2-3 phrases" },
                { "titre": "Exemple réaliste 2", "resume": "Description détaillée" },
                { "titre": "Exemple réaliste 3", "resume": "Description détaillée" }
              ]
            },
            "db_secondaire": {
              "titre": "Nom de la DB",
              "emoji": "📋",
              "intro": "Phrase d'intro pour cette section",
              "col_titre": "Nom colonne titre",
              "nom_relation": "Nom colonne relation vers DB principale",
              "colonnes": [
                { "nom": "Priorité", "type_notion": "select" },
                { "nom": "Deadline", "type_notion": "date" },
                { "nom": "Terminé", "type_notion": "checkbox" }
              ],
              "donnees": [
                { "titre": "Tâche réaliste 1", "parent_index": 0 },
                { "titre": "Tâche réaliste 2", "parent_index": 0 },
                { "titre": "Tâche réaliste 3", "parent_index": 1 },
                { "titre": "Tâche réaliste 4", "parent_index": 1 },
                { "titre": "Tâche réaliste 5", "parent_index": 2 }
              ]
            },
            "db_reference": {
              "titre": "Nom de la DB",
              "emoji": "📚",
              "intro": "Phrase d'intro pour cette section",
              "col_titre": "Nom colonne titre",
              "colonnes": [
                { "nom": "Catégorie", "type_notion": "select" },
                { "nom": "Lien", "type_notion": "url" }
              ],
              "donnees": [
                { "titre": "Ressource 1", "contenu": "Procédure détaillée étape par étape avec 5-6 étapes numérotées" },
                { "titre": "Ressource 2", "contenu": "Procédure détaillée étape par étape" },
                { "titre": "Ressource 3", "contenu": "Procédure détaillée étape par étape" }
              ]
            }
          }
          ATTENTION : type_notion UNIQUEMENT parmi : rich_text, number, select, checkbox, date, url.
          Génère des données ULTRA-RÉALISTES et pertinentes au domaine.`
        },
        { role: "user", content: `Crée un système professionnel complet pour : ${prompt}` }
      ],
      response_format: { type: "json_object" }
    });

    const ai = JSON.parse(response.choices[0].message.content as string);
    console.log(`2. 🏗️ Système reçu : ${ai.nom_systeme}`);

    const rootPageId = process.env.NOTION_PARENT_PAGE_ID!;

    // ================================================================
    // 3. DASHBOARD PREMIUM
    // ================================================================
    console.log("-> Dashboard...");
    const dashboard = await fetchNotion("pages", "POST", {
      parent: { type: "page_id", page_id: rootPageId },
      icon: { type: "emoji", emoji: ai.emoji || "🚀" },
      cover: { type: "external", external: { url: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=2564&auto=format&fit=crop" } },
      properties: { title: { title: [{ text: { content: ai.nom_systeme || "Système" } }] } },
      children: [
        {
          object: "block", type: "callout",
          callout: {
            rich_text: [{ type: "text", text: { content: ai.pitch || "Bienvenue" }, annotations: { bold: true } }],
            icon: { type: "emoji", emoji: "⚡" },
            color: "blue_background"
          }
        },
        { object: "block", type: "divider", divider: {} },
        {
          object: "block", type: "callout",
          callout: {
            rich_text: [
              { type: "text", text: { content: "MÉTHODOLOGIE\n" }, annotations: { bold: true } },
              { type: "text", text: { content: ai.methodologie || "Système optimisé." } }
            ],
            icon: { type: "emoji", emoji: "🧠" },
            color: "gray_background"
          }
        },
        {
          object: "block", type: "column_list",
          column_list: {
            children: [
              {
                object: "block", type: "column",
                column: {
                  children: [
                    { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: "⚡ Actions Rapides" } }] } },
                    { object: "block", type: "to_do", to_do: { rich_text: [{ type: "text", text: { content: "Lire le Mode d'Emploi" } }], checked: false } },
                    { object: "block", type: "to_do", to_do: { rich_text: [{ type: "text", text: { content: "Explorer chaque espace" } }], checked: false } },
                    { object: "block", type: "to_do", to_do: { rich_text: [{ type: "text", text: { content: "Créer ma première entrée" } }], checked: false } },
                    { object: "block", type: "to_do", to_do: { rich_text: [{ type: "text", text: { content: "Configurer mes vues favorites" } }], checked: false } }
                  ]
                }
              },
              {
                object: "block", type: "column",
                column: {
                  children: [
                    { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: "💎 Philosophie" } }] } },
                    { object: "block", type: "quote", quote: { rich_text: [{ type: "text", text: { content: ai.citation || "Un objectif sans système n'est qu'un souhait." } }] } },
                    {
                      object: "block", type: "callout",
                      callout: {
                        rich_text: [{ type: "text", text: { content: "Clique sur '+' à côté de 'Table' pour activer Kanban, Galerie ou Calendrier !" } }],
                        icon: { type: "emoji", emoji: "🪄" },
                        color: "yellow_background"
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        { object: "block", type: "divider", divider: {} },
        { object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: "🗂️ Tes Espaces de Travail" } }] } },
        {
          object: "block", type: "paragraph",
          paragraph: { rich_text: [{ type: "text", text: { content: "Navigue dans tes espaces ci-dessous. Chaque espace contient sa propre base de données et ses instructions." }, annotations: { italic: true, color: "gray" } }] }
        }
      ]
    });
    const dashboardId = dashboard.id;

    // ================================================================
    // 4. CRÉATION DES 3 SOUS-PAGES (Architecture App-Like)
    // ================================================================
    console.log("-> Espace 1 (Principal)...");
    const space1 = await fetchNotion("pages", "POST", {
      parent: { type: "page_id", page_id: dashboardId },
      icon: { type: "emoji", emoji: ai.db_principale?.emoji || "📊" },
      properties: { title: { title: [{ text: { content: ai.db_principale?.titre || "Base Principale" } }] } },
      children: [
        {
          object: "block", type: "callout",
          callout: {
            rich_text: [{ type: "text", text: { content: ai.db_principale?.intro || "Ton espace principal." } }],
            icon: { type: "emoji", emoji: "📌" }, color: "blue_background"
          }
        },
        {
          object: "block", type: "callout",
          callout: {
            rich_text: [{ type: "text", text: { content: "💡 Clique sur '+' à côté de 'Table' pour passer en vue Kanban ou Galerie." } }],
            icon: { type: "emoji", emoji: "🪄" }, color: "yellow_background"
          }
        },
        { object: "block", type: "divider", divider: {} }
      ]
    });
    const space1Id = space1.id;

    console.log("-> Espace 2 (Secondaire)...");
    const space2 = await fetchNotion("pages", "POST", {
      parent: { type: "page_id", page_id: dashboardId },
      icon: { type: "emoji", emoji: ai.db_secondaire?.emoji || "📋" },
      properties: { title: { title: [{ text: { content: ai.db_secondaire?.titre || "Base Secondaire" } }] } },
      children: [
        {
          object: "block", type: "callout",
          callout: {
            rich_text: [{ type: "text", text: { content: ai.db_secondaire?.intro || "Ton espace secondaire." } }],
            icon: { type: "emoji", emoji: "📌" }, color: "green_background"
          }
        },
        {
          object: "block", type: "callout",
          callout: {
            rich_text: [{ type: "text", text: { content: "💡 Ajoute une vue Calendrier ici pour visualiser tes deadlines." } }],
            icon: { type: "emoji", emoji: "🪄" }, color: "yellow_background"
          }
        },
        { object: "block", type: "divider", divider: {} }
      ]
    });
    const space2Id = space2.id;

    console.log("-> Espace 3 (Référence)...");
    const space3 = await fetchNotion("pages", "POST", {
      parent: { type: "page_id", page_id: dashboardId },
      icon: { type: "emoji", emoji: ai.db_reference?.emoji || "📚" },
      properties: { title: { title: [{ text: { content: ai.db_reference?.titre || "Références" } }] } },
      children: [
        {
          object: "block", type: "callout",
          callout: {
            rich_text: [{ type: "text", text: { content: ai.db_reference?.intro || "Tes ressources et procédures." } }],
            icon: { type: "emoji", emoji: "📌" }, color: "purple_background"
          }
        },
        { object: "block", type: "divider", divider: {} }
      ]
    });
    const space3Id = space3.id;

    // ================================================================
    // 5. LIENS DE NAVIGATION SUR LE DASHBOARD
    // ================================================================
    console.log("-> Navigation...");
    await appendBlocks(dashboardId, [
      { object: "block", type: "link_to_page", link_to_page: { type: "page_id", page_id: space1Id } },
      { object: "block", type: "link_to_page", link_to_page: { type: "page_id", page_id: space2Id } },
      { object: "block", type: "link_to_page", link_to_page: { type: "page_id", page_id: space3Id } }
    ]);

    // ================================================================
    // 6. DB PRINCIPALE + DATA + CONTENU
    // ================================================================
    console.log("-> DB Principale...");
    const mainProps: any = { [ai.db_principale.col_titre || "Nom"]: { title: {} } };
    for (const col of (ai.db_principale.colonnes || [])) {
      mainProps[col.nom] = { [getValidType(col.type_notion)]: {} };
    }

    const dbMain = await fetchNotion("databases", "POST", {
      parent: { type: "page_id", page_id: space1Id },
      title: [{ type: "text", text: { content: ai.db_principale.titre || "Base Principale" } }],
      properties: mainProps,
      is_inline: true
    });
    const dbMainId = dbMain.id;

    console.log("-> Data Principale + Fiches...");
    const mainRowIds: string[] = [];
    for (const item of (ai.db_principale.donnees || [])) {
      const row = await fetchNotion("pages", "POST", {
        parent: { type: "database_id", database_id: dbMainId },
        properties: {
          [ai.db_principale.col_titre || "Nom"]: { title: [{ text: { content: item.titre || "Item" } }] }
        }
      });
      mainRowIds.push(row.id);

      if (item.resume) {
        await appendBlocks(row.id, [
          {
            object: "block", type: "callout",
            callout: {
              rich_text: [{ type: "text", text: { content: item.resume } }],
              icon: { type: "emoji", emoji: "📝" }, color: "gray_background"
            }
          }
        ]);
      }
    }

    // ================================================================
    // 7. DB SECONDAIRE + RELATION + DATA
    // ================================================================
    console.log("-> DB Secondaire + Relation...");
    const childProps: any = { [ai.db_secondaire.col_titre || "Nom"]: { title: {} } };
    for (const col of (ai.db_secondaire.colonnes || [])) {
      childProps[col.nom] = { [getValidType(col.type_notion)]: {} };
    }
    childProps[ai.db_secondaire.nom_relation || "Lien"] = {
      relation: { database_id: dbMainId, single_property: {} }
    };

    const dbChild = await fetchNotion("databases", "POST", {
      parent: { type: "page_id", page_id: space2Id },
      title: [{ type: "text", text: { content: ai.db_secondaire.titre || "Base Secondaire" } }],
      properties: childProps,
      is_inline: true
    });
    const dbChildId = dbChild.id;

    console.log("-> Data Secondaire + Relations...");
    for (const item of (ai.db_secondaire.donnees || [])) {
      const parentIndex = item.parent_index ?? 0;
      const parentId = mainRowIds.length > 0 ? mainRowIds[parentIndex % mainRowIds.length] : null;

      const props: any = {
        [ai.db_secondaire.col_titre || "Nom"]: { title: [{ text: { content: item.titre || "Tâche" } }] }
      };
      if (parentId) {
        props[ai.db_secondaire.nom_relation || "Lien"] = { relation: [{ id: parentId }] };
      }

      await fetchNotion("pages", "POST", {
        parent: { type: "database_id", database_id: dbChildId },
        properties: props
      });
    }

    // ================================================================
    // 8. DB RÉFÉRENCE + DATA + SOPs (Axe 2 : Injection de Savoir)
    // ================================================================
    console.log("-> DB Référence...");
    const refProps: any = { [ai.db_reference.col_titre || "Nom"]: { title: {} } };
    for (const col of (ai.db_reference.colonnes || [])) {
      refProps[col.nom] = { [getValidType(col.type_notion)]: {} };
    }

    const dbRef = await fetchNotion("databases", "POST", {
      parent: { type: "page_id", page_id: space3Id },
      title: [{ type: "text", text: { content: ai.db_reference.titre || "Références" } }],
      properties: refProps,
      is_inline: true
    });
    const dbRefId = dbRef.id;

    console.log("-> Data Référence + SOPs détaillés...");
    for (const item of (ai.db_reference.donnees || [])) {
      const row = await fetchNotion("pages", "POST", {
        parent: { type: "database_id", database_id: dbRefId },
        properties: {
          [ai.db_reference.col_titre || "Nom"]: { title: [{ text: { content: item.titre || "Ressource" } }] }
        }
      });

      if (item.contenu) {
        await appendBlocks(row.id, [
          {
            object: "block", type: "heading_3",
            heading_3: { rich_text: [{ type: "text", text: { content: `📋 ${item.titre}` } }] }
          },
          {
            object: "block", type: "paragraph",
            paragraph: { rich_text: [{ type: "text", text: { content: item.contenu } }] }
          },
          { object: "block", type: "divider", divider: {} },
          {
            object: "block", type: "callout",
            callout: {
              rich_text: [{ type: "text", text: { content: "Personnalise cette procédure selon tes besoins spécifiques." } }],
              icon: { type: "emoji", emoji: "✏️" }, color: "gray_background"
            }
          }
        ]);
      }
    }

    // ================================================================
    // 9. QUÊTES D'ONBOARDING + PRO TIPS + SIGNATURE (Axe 3)
    // ================================================================
    console.log("-> Onboarding + Signature...");
    const questBlocks = (ai.quetes || [
      "Lis le Mode d'Emploi",
      "Transforme une base en vue Kanban",
      "Crée ta première entrée",
      "Invite un collaborateur"
    ]).map((quest: string) => ({
      object: "block", type: "to_do",
      to_do: { rich_text: [{ type: "text", text: { content: quest } }], checked: false }
    }));

    const tipBlocks = (ai.astuces || []).map((tip: string) => ({
      object: "block", type: "bulleted_list_item",
      bulleted_list_item: { rich_text: [{ type: "text", text: { content: tip } }] }
    }));

    await appendBlocks(dashboardId, [
      { object: "block", type: "divider", divider: {} },
      {
        object: "block", type: "toggle",
        toggle: {
          rich_text: [{ type: "text", text: { content: "🏆 Quêtes de Configuration — Clique pour débloquer" }, annotations: { bold: true } }],
          children: questBlocks
        }
      },
      { object: "block", type: "divider", divider: {} },
      {
        object: "block", type: "toggle",
        toggle: {
          rich_text: [{ type: "text", text: { content: "🎯 Pro Tips — Astuces d'expert" }, annotations: { bold: true } }],
          children: tipBlocks
        }
      },
      { object: "block", type: "divider", divider: {} },
      {
        object: "block", type: "callout",
        callout: {
          rich_text: [{ type: "text", text: { content: "Ce système a été généré par NotionGen — notiongen.vercel.app" } }],
          icon: { type: "emoji", emoji: "✨" }, color: "purple_background"
        }
      }
    ]);

    // ================================================================
    // 10. MODE D'EMPLOI (Page dédiée)
    // ================================================================
    console.log("-> Mode d'Emploi...");
    await fetchNotion("pages", "POST", {
      parent: { type: "page_id", page_id: dashboardId },
      icon: { type: "emoji", emoji: "📘" },
      properties: { title: { title: [{ text: { content: "📘 Mode d'Emploi Complet" } }] } },
      children: [
        {
          object: "block", type: "callout",
          callout: {
            rich_text: [{ type: "text", text: { content: "Lis ce guide AVANT de commencer. Il t'explique comment tirer le maximum de ton système." }, annotations: { italic: true } }],
            icon: { type: "emoji", emoji: "⚠️" }, color: "red_background"
          }
        },
        { object: "block", type: "divider", divider: {} },
        {
          object: "block", type: "paragraph",
          paragraph: { rich_text: [{ type: "text", text: { content: ai.guide || "Bienvenue dans ton nouveau système." } }] }
        }
      ]
    });

    console.log("✅ SYSTÈME ULTIME PREMIUM TERMINÉ !");
    const cleanId = dashboardId.replace(/-/g, "");
    return { success: true, url: `https://notion.so/${cleanId}` };

  } catch (error) {
    console.error("Erreur fatale:", error);
    return { success: false, error: "Bug du système" };
  }
}