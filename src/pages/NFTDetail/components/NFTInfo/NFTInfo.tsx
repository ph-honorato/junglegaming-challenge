import { Heart, Mail, Minus, Plus, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@components";

import { useNFTInfo } from "./NFTInfo.hook";
import type { NFTInfoProps } from "./NFTInfo.types";

// Brand icons are not available in lucide, so LinkedIn and X are inline SVGs.
function LinkedInIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
    </svg>
  );
}

export function NFTInfo({ nft }: NFTInfoProps) {
  const { t } = useTranslation();
  const {
    quantity,
    increaseQuantity,
    decreaseQuantity,
    canIncrease,
    canDecrease,
    selectedEditionIndex,
    selectEdition,
  } = useNFTInfo(nft);

  const rating = Math.round(nft.rating ?? 0);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedShareUrl = encodeURIComponent(shareUrl);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {nft.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xl font-bold text-primary md:text-2xl">
          {Number(nft.price).toFixed(2)} ETH
        </p>
        <div className="flex items-center gap-2">
          <div
            role="img"
            aria-label={t("nftDetail.ratingLabel", { rating: nft.rating ?? 0 })}
            className="flex items-center gap-0.5"
          >
            {[0, 1, 2, 3, 4].map((index) => (
              <Star
                key={index}
                className={
                  "h-4 w-4 " +
                  (index < rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/40")
                }
              />
            ))}
          </div>
          <span className="text-sm text-foreground">
            {t("nftDetail.reviewsShort", { count: nft.reviews?.length ?? 0 })}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-bold text-foreground">
          {t("nftDetail.about")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {nft.description}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-bold text-foreground">
          {t("nftDetail.edition")}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {(nft.editions ?? []).map((editionLabel, i) => (
            <button
              key={editionLabel + i}
              type="button"
              aria-pressed={i === selectedEditionIndex}
              onClick={() => selectEdition(i)}
              className={
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors " +
                (i === selectedEditionIndex
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground")
              }
            >
              {editionLabel}
            </button>
          ))}
          <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground">
            {t(
              "nftDetail.editionStatus." +
                (nft.editionStatus ?? "ABERTA").toLowerCase(),
            )}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-border"
            aria-label={t("nftDetail.decreaseQuantity")}
            disabled={!canDecrease}
            onClick={decreaseQuantity}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span
            className="min-w-6 text-center text-lg font-semibold text-foreground"
            aria-label={t("nftDetail.quantity")}
          >
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-border"
            aria-label={t("nftDetail.increaseQuantity")}
            disabled={!canIncrease}
            onClick={increaseQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {/* Intentionally inert: purchase flow is out of scope. */}
        <Button className="h-11 rounded-lg bg-primary px-8 text-sm font-bold tracking-wide text-primary-foreground hover:bg-primary/90">
          {t("nftDetail.buy")}
        </Button>
        {/* Intentionally inert: favorite flow is out of scope. */}
        <Button
          variant="outline"
          className="h-11 gap-2 rounded-lg border-border px-5 text-sm font-semibold text-foreground hover:bg-surface-dark"
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
          {t("nftDetail.favorite")}
        </Button>
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-sm">
          <span className="font-bold text-foreground">
            {t("nftDetail.tokenId")}
          </span>{" "}
          <span className="text-muted-foreground">{nft.tokenId ?? ""}</span>
        </p>
        <p className="text-sm">
          <span className="font-bold text-foreground">
            {t("nftDetail.collection")}
          </span>{" "}
          <span className="text-muted-foreground">{nft.collection}</span>
        </p>
        <p className="text-sm">
          <span className="font-bold text-foreground">
            {t("nftDetail.attributes")}
          </span>{" "}
          <span className="text-muted-foreground">
            {(nft.attributes ?? []).join(", ")}
          </span>
        </p>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-bold text-foreground">
          {t("nftDetail.share")}
        </span>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("nftDetail.shareLinkedin")}
          className="text-foreground transition-colors hover:text-primary"
        >
          <LinkedInIcon />
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(nft.name)}&body=${encodedShareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("nftDetail.shareEmail")}
          className="text-foreground transition-colors hover:text-primary"
        >
          <Mail className="h-4 w-4" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodeURIComponent(nft.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("nftDetail.shareTwitter")}
          className="text-foreground transition-colors hover:text-primary"
        >
          <XIcon />
        </a>
      </div>
    </div>
  );
}
