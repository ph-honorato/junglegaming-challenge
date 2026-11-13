// CatalogFilters Types
export interface CatalogFiltersProps {
  categories: { category: string; count: number }[];
  networks: { network: string; count: number }[];
  priceRange: { min: string; max: string };
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}
