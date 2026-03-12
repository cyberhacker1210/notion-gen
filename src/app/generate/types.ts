export interface Column {
  name: string;
  type: "rich_text" | "number" | "select" | "multi_select" | "checkbox" | "date" | "url" | "email";
  options?: string[]; // Pour select/multi_select
}

export interface DatabaseSchema {
  key: string;
  title: string;
  emoji: string;
  description: string;
  title_column: string;
  columns: Column[];
  relates_to?: string; // Clé de la DB parente
  relation_name?: string;
  is_core_hub?: boolean;
}

export interface RowData {
  title: string;
  values: Record<string, any>;
}

export interface ContentData {
  [db_key: string]: RowData[];
}

export interface UXPlan {
  system_name: string;
  system_emoji: string;
  tagline: string;
  quote: string;
  kpis: Array<{ label: string; value: string }>;
  quick_actions: Array<{ label: string; emoji: string }>;
  navigation: Array<{ label: string; emoji: string; link_key?: string }>;
}