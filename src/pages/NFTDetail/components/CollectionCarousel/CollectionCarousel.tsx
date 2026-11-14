import { useTranslation } from "react-i18next";
import { Carousel, NFTCard } from "@components";
import type { NFT } from "@/types/nft";
import { useCollectionNFTs } from "./CollectionCarousel.hook";
import type { CollectionCarouselProps } from "./CollectionCarousel.types";

export function CollectionCarousel({ collection }: CollectionCarouselProps) {
  const { t } = useTranslation();
  const { pages, isLoading } = useCollectionNFTs(collection);

  if (!isLoading && pages.length === 0) return null;

  return (
    <section aria-label={t("nftDetail.moreFromCollection")} className="w-full">
      <h2 className="text-lg font-bold text-primary md:text-xl">
        {t("nftDetail.moreFromCollection")}
      </h2>

      {isLoading && pages.length === 0 ? (
        <div
          role="status"
          aria-label={t("nftDetail.collectionLoading")}
          aria-busy="true"
          className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <NFTCard
              key={"skeleton-" + i}
              nft={null as unknown as NFT}
              isLoading
            />
          ))}
        </div>
      ) : (
        <Carousel
          className="mt-6 pb-12"
          items={pages}
          showDots
          renderItem={(page) => (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {page.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          )}
        />
      )}
    </section>
  );
}
