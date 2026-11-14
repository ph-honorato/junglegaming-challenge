import { X } from "lucide-react";
import { Button, Checkbox, Slider } from "@components";
import { useCatalog } from "../../CatalogContext";
import { useTranslation } from "react-i18next";

export function CatalogFilters() {
  const { t } = useTranslation();
  const {
    searchParams,
    categories,
    networks,
    priceRange,
    isMobileFiltersOpen,
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
    children: React.ReactNode,
    filterKey: keyof typeof searchParams,
  ) => (
    <div className="border-border last:border-0 last:pb-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">{title}</h3>
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

  const filtersContent = (
    <div className="bg-card space-y-8 p-6">
      {renderFilterSection(
        t("home.catalog.filters.collections"),
        <div className="space-y-2 max-h-60 overflow-y-auto px-2 checkbox-filter">
          {categories.map(({ category, count }) => (
            <label
              key={category}
              className={`flex items-center gap-3 cursor-pointer group hover:bg-accent transition-colors ${
                searchParams.category === category
                  ? "selected-option"
                  : "option"
              }`}
            >
              <Checkbox
                checked={searchParams.category === category}
                onCheckedChange={(checked: boolean) =>
                  handleCategoryChange(category, checked)
                }
                aria-label={`${category} (${count})`}
              />
              <span className="text-sm flex-1 truncate group-hover:text-foreground transition-colors">
                {category}
              </span>
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                {`(${count})`}
              </span>
            </label>
          ))}
        </div>,
        "category",
      )}

      {renderFilterSection(
        t("home.catalog.filters.priceRange"),
        <div className="space-y-4 pl-2">
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
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">
              {`${t("nft.price")}: ${minPriceInput.toFixed(2)} - ${maxPriceInput.toFixed(2)} ETH`}
            </span>
          </div>
          <Button variant={"default"} onClick={applyPriceInputs}>
            {t("home.catalog.filters.apply")}
          </Button>
        </div>,
        "minPrice",
      )}

      {renderFilterSection(
        t("home.catalog.filters.network"),
        <div className="space-y-2 px-2 checkbox-filter">
          {networks.map(({ network, count }) => (
            <label
              key={network}
              className={`flex items-center gap-3 cursor-pointer group hover:bg-accent transition-colors ${
                searchParams.network === network
                  ? "selected-option"
                  : "option"
              }`}
            >
              <Checkbox
                checked={searchParams.network === network}
                onCheckedChange={(checked: boolean) =>
                  handleNetworkChange(network, checked)
                }
                aria-label={`${network} (${count})`}
              />
              <span className="text-sm flex-1 capitalize group-hover:text-foreground transition-colors">
                {network}
              </span>
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                {`(${count})`}
              </span>
            </label>
          ))}
        </div>,
        "network",
      )}

      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full border-border hover:border-primary/50 hover:text-primary transition-colors"
          onClick={clearFilters}
        >
          {t("home.catalog.filters.clear")}
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block w-64 xl:w-72 flex-shrink-0"
        aria-label={t("home.catalog.filters.title")}
      >
        <div className="sticky top-24">
          {filtersContent}

          {/* Featured NFT Promo Card matching Figma */}
          <div className="bg-card pt-2 mt-6">
            <div className="my-2 ml-6">
              <p className="text-primary text-lg font-bold uppercase tracking-wider mb-2">
                {t("home.catalog.featured.label")}
              </p>
              <h4 className="text-foreground text-lg font-bold uppercase tracking-wider ml-2">
                {t("home.catalog.featured.subtitle")}
              </h4>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
              <img
                src="/images/nfts/placeholder-2.svg"
                alt="NFT em Destaque"
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile: filters drawer */}
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
            <div className="flex-1 overflow-y-auto p-4">{filtersContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
