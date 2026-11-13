import { useTranslation } from "react-i18next";
import { NFTGrid, Pagination } from "@components";
import { CatalogProvider } from "./CatalogContext";
import { CatalogFilters, CatalogTabs, SortSelect } from "./components";
import type { CatalogSectionProps } from "./CatalogSection.types";

export function CatalogSection({
  nfts,
  isLoading = false,
  onFavorite,
  favorites,
  totalCount: _totalCount,
  totalPages,
  currentPage,
  onPageChange,
  isError = false,
  categories = [],
  networks = [],
  priceRange = { min: "0", max: "10" },
}: CatalogSectionProps) {
  const { t } = useTranslation();

  return (
    <CatalogProvider
      initialCategories={categories}
      initialNetworks={networks}
      initialPriceRange={priceRange}
    >
      <section
        id="catalog"
        aria-labelledby="catalog-heading"
        className="py-8 lg:py-12"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="catalog-heading" className="sr-only">
            {t("home.catalog.title")}
          </h2>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
              <CatalogFilters
                categories={categories}
                networks={networks}
                priceRange={priceRange}
              />
            </div>

            {/* Main Catalog Area */}
            <div className="flex-1 min-w-0 w-full">
              {/* Header with Tabs on left and Sort on right */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-border/40 pb-2">
                <CatalogTabs />
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <SortSelect />
                </div>
              </div>

              {/* NFT Grid */}
              <NFTGrid
                nfts={nfts}
                isLoading={isLoading}
                onFavorite={onFavorite}
                favorites={favorites}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-end">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    aria-label={t("common.pagination")}
                  />
                </div>
              )}

              {/* Error State */}
              {isError && !isLoading && (
                <div className="mt-8 text-center">
                  <p className="text-destructive mb-4">{t("common.error")}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-primary hover:underline"
                  >
                    {t("common.retry")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </CatalogProvider>
  );
}
