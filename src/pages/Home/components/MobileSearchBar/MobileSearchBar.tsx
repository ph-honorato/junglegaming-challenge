// MobileSearchBar Component (Home-specific)
import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button, Input } from "@components";
import { cn } from "@/lib/utils";
import { useCatalog } from "../CatalogSection";
import { useTranslation } from "react-i18next";
import type { MobileSearchBarProps } from "./MobileSearchBar.types";

export function MobileSearchBar({ className }: MobileSearchBarProps) {
  const { t } = useTranslation();
  const { searchParams, setQuery, setIsMobileFiltersOpen, hasActiveFilters } =
    useCatalog();
  const [term, setTerm] = React.useState(searchParams.q ?? "");

  // Keep the input in sync when the query param changes externally (e.g. back navigation)
  React.useEffect(() => {
    setTerm(searchParams.q ?? "");
  }, [searchParams.q]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = term.trim();
    setQuery(value ? value : undefined);
  };

  return (
    <div className={cn("lg:hidden px-4 pt-4", className)}>
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1 min-w-0">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder={t("home.catalog.searchPlaceholder")}
            aria-label={t("common.search")}
            className="h-12 rounded-full bg-card border-border pl-11 pr-4 text-sm"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setIsMobileFiltersOpen(true)}
          aria-label={t("home.catalog.filters.title")}
          aria-haspopup="dialog"
          className={cn(
            "h-12 w-12 flex-shrink-0 rounded-2xl bg-card border-border hover:border-primary/50 hover:text-primary transition-colors",
            hasActiveFilters && "border-primary/50 text-primary",
          )}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
