// CatalogTabs Types
export type CatalogTab = "all" | "new" | "trending";

export interface CatalogTabConfig {
  value: CatalogTab;
  label: string;
}

export const CATALOG_TABS: CatalogTabConfig[] = [
  { value: "all", label: "home.catalog.tabs.all" },
  { value: "new", label: "home.catalog.tabs.new" },
  { value: "trending", label: "home.catalog.tabs.trending" },
];
