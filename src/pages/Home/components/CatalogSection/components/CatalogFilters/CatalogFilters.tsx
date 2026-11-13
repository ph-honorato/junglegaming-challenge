import { Filter, X } from "lucide-react";
import { Button, Checkbox, Slider } from "@components";
import { cn } from "@/lib/utils";
import { useCatalog } from "../../CatalogContext";
import type { CatalogFiltersProps } from "./CatalogFilters.types";
import { useTranslation } from "react-i18next";

export function CatalogFilters(_props: CatalogFiltersProps) {
  const { t } = useTranslation();
  const {
    searchParams,
    categories,
    networks,
    priceRange,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    minPriceInput,
    maxPriceInput,
    hasActiveFilters,
    setCategory,
    setNetwork,
    setMinPriceInput,
    setMaxPriceInput,
    applyPriceInputs,
    clearFilters,
    closeMobileFilters,
  } = useCatalog();

  const renderFilterSection = (
    title: string,
    icon: React.ReactNode,
    children: React.ReactNode,
    filterKey: keyof typeof searchParams,
  ) => (
    <div className="border-b border-border pb-6 last:border-0 last:pb-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h3>
        {searchParams[filterKey] && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (filterKey === "category") setCategory(undefined);
              else if (filterKey === "network") setNetwork(undefined);
              else if (filterKey === "minPrice" || filterKey === "maxPrice") {
                // For price, we clear both
                setMinPriceInput(parseFloat(priceRange.min));
                setMaxPriceInput(parseFloat(priceRange.max));
                applyPriceInputs();
              }
            }}
            aria-label={`${t("common.clear")} ${title.toLowerCase()}`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {children}
    </div>
  );

  const handleCategoryChange = (category: string, checked: boolean) => {
    setCategory(checked ? category : undefined);
  };

  const handleNetworkChange = (network: string, checked: boolean) => {
    setNetwork(checked ? network : undefined);
  };

  const handleMinPriceChange = (value: string) => {
    const num = value === "" ? 0 : parseFloat(value);
    if (!isNaN(num)) {
      setMinPriceInput(Math.min(num, maxPriceInput));
    }
  };

  const handleMaxPriceChange = (value: string) => {
    const num = value === "" ? parseFloat(priceRange.max) : parseFloat(value);
    if (!isNaN(num)) {
      setMaxPriceInput(Math.max(num, minPriceInput));
    }
  };

  const sidebarContent = (
    <aside
      className="w-full lg:w-72 flex-shrink-0"
      aria-label={t("home.catalog.filters.title")}
    >
      <div className="sticky top-24 space-y-8 p-6 bg-card border border-border rounded-xl">
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileFilters}
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {renderFilterSection(
          t("home.catalog.filters.collections"),
          <Filter className="h-4 w-4" />,
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {categories.map(({ category, count }) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Checkbox
                  checked={searchParams.category === category}
                  onCheckedChange={(checked: boolean) =>
                    handleCategoryChange(category, checked)
                  }
                  aria-label={`${category} (${count})`}
                  className="text-primary"
                />
                <span className="text-sm flex-1 truncate group-hover:text-foreground transition-colors">
                  {category}
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                  {count}
                </span>
              </label>
            ))}
          </div>,
          "category",
        )}

        {renderFilterSection(
          t("home.catalog.filters.priceRange"),
          <Filter className="h-4 w-4" />,
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t("home.catalog.filters.minPrice")}
              </span>
              <span className="font-medium text-foreground">
                {minPriceInput.toFixed(4)} ETH
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                {maxPriceInput.toFixed(4)} ETH
              </span>
              <span className="text-muted-foreground">
                {t("home.catalog.filters.maxPrice")}
              </span>
            </div>
            <Slider
              min={parseFloat(priceRange.min)}
              max={parseFloat(priceRange.max)}
              step={0.001}
              value={[minPriceInput, maxPriceInput]}
              onValueChange={([min, max]) => {
                setMinPriceInput(min);
                setMaxPriceInput(max);
              }}
              className="mb-4"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  {t("home.catalog.filters.minPrice")} (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min={parseFloat(priceRange.min)}
                  max={maxPriceInput}
                  value={minPriceInput.toFixed(4)}
                  onChange={(e) => handleMinPriceChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  aria-label={t("home.catalog.filters.minPrice")}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  {t("home.catalog.filters.maxPrice")} (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min={minPriceInput}
                  max={parseFloat(priceRange.max)}
                  value={maxPriceInput.toFixed(4)}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  aria-label={t("home.catalog.filters.maxPrice")}
                />
              </div>
            </div>
            <Button className="w-full" onClick={applyPriceInputs}>
              {t("home.catalog.filters.apply")}
            </Button>
          </div>,
          "minPrice",
        )}

        {renderFilterSection(
          t("home.catalog.filters.network"),
          <Filter className="h-4 w-4" />,
          <div className="space-y-2 pr-2">
            {networks.map(({ network, count }) => (
              <label
                key={network}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Checkbox
                  checked={searchParams.network === network}
                  onCheckedChange={(checked: boolean) =>
                    handleNetworkChange(network, checked)
                  }
                  aria-label={`${network} (${count})`}
                  className="text-primary"
                />
                <span className="text-sm flex-1 capitalize group-hover:text-foreground transition-colors">
                  {network}
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                  {count}
                </span>
              </label>
            ))}
          </div>,
          "network",
        )}

        {/* Featured NFT Promo Card matching Figma */}
        <div className="pt-2">
          <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
            {t("home.catalog.featured.label", {
              defaultValue: "NFT EM DESTAQUE",
            })}
          </p>
          <h4 className="text-foreground text-sm font-bold uppercase tracking-wider mb-3">
            {t("home.catalog.featured.subtitle", {
              defaultValue: "OFERTA LIMITADA",
            })}
          </h4>
          <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
            <img
              src="/images/nfts/placeholder-2.svg"
              alt="NFT em Destaque"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            className="w-full border-border hover:border-primary/50 hover:text-primary transition-colors"
            onClick={clearFilters}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {t("home.catalog.filters.clear")}
          </Button>
        )}
      </div>
    </aside>
  );

  // Mobile: render as drawer
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    return (
      <>
        <Button
          variant="outline"
          className={cn(
            "lg:hidden w-full justify-between",
            hasActiveFilters && "border-primary/50 text-primary",
          )}
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          <span>{t("home.catalog.filters.title")}</span>
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {
                Object.keys(searchParams).filter((k) =>
                  ["category", "network", "minPrice", "maxPrice"].includes(k),
                ).length
              }
            </span>
          )}
        </Button>

        {isMobileFiltersOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-background"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filters-title"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
                <h2 id="filters-title" className="text-lg font-semibold">
                  {t("home.catalog.filters.title")}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileFilters}
                  aria-label={t("common.close")}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">{sidebarContent}</div>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{sidebarContent}</>;
}
