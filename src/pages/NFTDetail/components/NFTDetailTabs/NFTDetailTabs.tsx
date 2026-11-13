// NFTDetailTabs: tabbed section with the NFT details and collector reviews.
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components";
import type { NFTDetailTabsProps } from "./NFTDetailTabs.types";

// Trigger styling that replaces the default shadcn trigger look: the active
// tab gets an orange underline over the list's bottom border.
const triggerClassName =
  "rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-1 text-sm font-semibold text-foreground shadow-none transition-colors data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none md:text-base";

export function NFTDetailTabs({ nft }: NFTDetailTabsProps) {
  const { t } = useTranslation();

  const paragraphs = nft.longDescription?.length
    ? nft.longDescription
    : nft.description
      ? [nft.description]
      : [];
  const reviews = nft.reviews ?? [];
  const shortContract = nft.contract
    ? nft.contract.slice(0, 6) + "..." + nft.contract.slice(-4)
    : "";

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger value="details" className={triggerClassName}>
          {t("nftDetail.tabs.details")}
        </TabsTrigger>
        <TabsTrigger value="reviews" className={triggerClassName}>
          {t("nftDetail.tabs.reviews", { count: reviews.length })}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="mt-8 space-y-6">
        <div className="mt-8 space-y-6">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}

          <div>
            <h3 className="text-sm font-bold text-foreground">{t("nftDetail.network")}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t("nftDetail.networkMinted", { network: nft.network })}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground">{t("nftDetail.contract")}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t("nftDetail.contractInfo", {
                contract: shortContract,
                standard: nft.tokenStandard ?? "ERC-721",
              })}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground">{t("nftDetail.royalties")}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t("nftDetail.royaltiesInfo", { royalties: nft.royalties ?? 0 })}
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-8">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("nftDetail.reviewsEmpty")}</p>
        ) : (
          <>
            <h3 className="sr-only">{t("nftDetail.reviewsTitle")}</h3>
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4"
                >
                  {review.avatar && (
                    <img
                      src={review.avatar}
                      alt={t("nftDetail.reviewAvatar", { user: review.user })}
                      className="h-10 w-10 rounded-full border border-border"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{review.user}</span>
                      <div
                        role="img"
                        aria-label={t("nftDetail.reviewStars", { rating: review.rating })}
                        className="flex items-center gap-0.5"
                      >
                        {Array.from({ length: 5 }, (_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={
                              starIndex < review.rating
                                ? "h-3 w-3 fill-primary text-primary"
                                : "h-3 w-3 text-muted-foreground/40"
                            }
                          />
                        ))}
                      </div>
                      <time dateTime={review.date} className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(review.date))}
                      </time>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
