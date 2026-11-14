// NFT Detail Page
import { Link, useParams } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Skeleton,
} from "@components";
import { useNFTDetail } from "@/hooks/useNFTs";
import {
  NFTGallery,
  NFTInfo,
  NFTDetailTabs,
  CollectionCarousel,
} from "./components";

// Skeleton mirroring the page layout to avoid shifts while the NFT loads
function NFTDetailSkeleton() {
  const { t } = useTranslation();

  return (
    <div
      className="py-8 lg:py-12"
      role="status"
      aria-label={t("nftDetail.loading")}
      aria-busy="true"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-40" />
        <div className="mt-8 grid items-start gap-10 lg:mt-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="flex flex-col-reverse gap-4 md:flex-row">
            <div className="flex gap-3 md:w-24 md:flex-col">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={`gallery-skeleton-${index}`}
                  className="aspect-square w-20 rounded-lg md:w-full"
                />
              ))}
            </div>
            <Skeleton className="aspect-square flex-1 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
            <div className="flex flex-wrap justify-between gap-4">
              <Skeleton className="h-11 w-36 rounded-lg" />
              <Skeleton className="h-11 w-40 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NFTDetailErrorState({
  isNotFound,
  onRetry,
}: {
  isNotFound: boolean;
  onRetry: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-md px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {isNotFound
            ? t("nftDetail.notFound.title")
            : t("nftDetail.error.title")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {isNotFound
            ? t("nftDetail.notFound.description")
            : t("nftDetail.error.description")}
        </p>
        {isNotFound ? (
          <Button
            asChild
            className="mt-6 rounded-lg bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/">{t("nftDetail.notFound.backToMarket")}</Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onRetry}
            className="mt-6 rounded-lg border-border text-foreground"
          >
            {t("nftDetail.error.retry")}
          </Button>
        )}
      </div>
    </div>
  );
}

export function NFTDetailPage() {
  const { id } = useParams({ from: "/nft/$id" });
  const { t } = useTranslation();
  const { data: nft, isLoading, isError, error, refetch } = useNFTDetail(id);

  if (isError) {
    const isNotFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <NFTDetailErrorState isNotFound={isNotFound} onRetry={() => refetch()} />
    );
  }

  if (isLoading || !nft) {
    return <NFTDetailSkeleton />;
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">{t("nftDetail.breadcrumb.home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("nftDetail.breadcrumb.market")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div
          className="mt-8 grid items-start gap-10 lg:mt-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16"
          data-testid="nft-details"
        >
          <NFTGallery
            images={nft.gallery ?? (nft.image ? [nft.image] : [])}
            alt={nft.name}
          />
          <NFTInfo nft={nft} />
        </div>

        <div className="mt-16 lg:mt-20">
          <NFTDetailTabs nft={nft} />
        </div>

        <div className="mt-16 lg:mt-20">
          <CollectionCarousel collection={nft.collection} />
        </div>
      </div>
    </div>
  );
}

export default NFTDetailPage;
