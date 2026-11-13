// SortSelect Types
export type SortOption = "recent" | "price_asc" | "price_desc" | "popular";

export interface SortOptionConfig {
  value: SortOption;
  label: string;
}

export const SORT_OPTIONS: SortOptionConfig[] = [
  { value: "recent", label: "home.catalog.sort.recent" },
  { value: "price_asc", label: "home.catalog.sort.priceAsc" },
  { value: "price_desc", label: "home.catalog.sort.priceDesc" },
  { value: "popular", label: "home.catalog.sort.popular" },
];
