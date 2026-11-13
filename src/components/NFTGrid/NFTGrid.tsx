import { useTranslation } from "react-i18next";
import { NFTCard } from "../NFTCard";
import { Button } from "../ui";
import { RotateCcw } from "lucide-react";
import type { NFT } from "@/types/nft";

export interface NFTGridProps {
  nfts: NFT[];
  isLoading?: boolean;
  onFavorite?: (id: string) => void;
  favorites?: Set<string>;
  skeletonCount?: number;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function NFTGrid({
  nfts,
  isLoading,
  onFavorite,
  favorites = new Set(),
  skeletonCount = 8,
  onClearFilters,
  hasActiveFilters,
}: NFTGridProps) {
  const { t } = useTranslation();

  if (isLoading && nfts.length === 0) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        role="status"
        aria-label={t("nft.loading")}
        aria-busy="true"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <NFTCard key={`skeleton-${i}`} nft={null as any} isLoading />
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="col-span-full py-20 lg:py-24 text-center">
        <div className="max-w-md mx-auto">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
            <svg
              className="h-10 w-10 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">{t("nft.noResults")}</h3>
          <p className="text-muted-foreground mb-6">{t("nft.noResultsDesc")}</p>
          {hasActiveFilters && onClearFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t("home.catalog.filters.clear")}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      role="list"
      aria-label={t("nft.catalog")}
    >
      {nfts.map((nft) => (
        <NFTCard
          key={nft.id}
          nft={nft}
          onFavorite={onFavorite}
          isFavorite={favorites.has(nft.id)}
        />
      ))}
    </div>
  );
}
