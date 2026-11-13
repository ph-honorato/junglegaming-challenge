import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, Button, Skeleton } from "../ui";
import { useTranslation } from "react-i18next";
import * as React from "react";
import type { NFT } from "@/types/nft";

export interface NFTCardProps {
  nft: NFT;
  isLoading?: boolean;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export function NFTCard({
  nft,
  isLoading,
  onFavorite,
  isFavorite,
}: NFTCardProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  if (isLoading) {
    return (
      <Card className="group h-full flex flex-col bg-card border-border rounded-2xl p-3">
        <div className="aspect-square w-full mb-3 relative overflow-hidden rounded-xl bg-muted">
          <Skeleton className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent animate-pulse" />
        </div>
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </Card>
    );
  }

  const hasDiscount =
    nft.originalPrice !== undefined &&
    Number(nft.originalPrice) > Number(nft.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(nft.price) / Number(nft.originalPrice!)) * 100)
    : 0;

  return (
    <Card className="group h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-border hover:border-primary/40 rounded-2xl p-3">
      {/* Image Container with rounded corners */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-3">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-muted to-muted/50" />
        )}
        <img
          src={nft.image}
          alt={`${nft.name} by ${nft.creator || "Artist"}`}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
            "group-hover:scale-105",
          )}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <svg
              className="h-12 w-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-primary-foreground bg-primary rounded-full">
              -{discountPercent}%
            </span>
          </div>
        )}
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all opacity-0 group-hover:opacity-100 rounded-full"
          onClick={() => onFavorite?.(nft.id)}
          aria-label={
            isFavorite ? t("nft.removeFromFavorites") : t("nft.addToFavorites")
          }
          aria-pressed={isFavorite}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all duration-200",
              isFavorite
                ? "fill-red-500 text-red-500 scale-110"
                : "fill-none text-foreground hover:fill-red-500 hover:text-red-500",
            )}
            aria-hidden="true"
          />
        </Button>
      </div>

      {/* Card Info */}
      <div className="flex-1 flex flex-col justify-between px-1 pb-1">
        <h3 className="font-semibold text-base truncate mb-1 text-foreground group-hover:text-primary transition-colors">
          {nft.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-bold text-sm text-primary">
            {Number(nft.price).toFixed(2)} ETH
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {Number(nft.originalPrice!).toFixed(2)} ETH
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
