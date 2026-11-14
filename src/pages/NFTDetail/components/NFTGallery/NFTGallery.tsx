// NFTGallery Component
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Button, Dialog, DialogContent, DialogTitle } from "@components";
import { cn } from "@/lib/utils";
import { useNFTGallery } from "./NFTGallery.hook";
import type { NFTGalleryProps } from "./NFTGallery.types";

export function NFTGallery({ images, alt }: NFTGalleryProps) {
  const { t } = useTranslation();
  const {
    selectedIndex,
    selectedImage,
    selectImage,
    isZoomOpen,
    openZoom,
    closeZoom,
  } = useNFTGallery(images);

  return (
    <section aria-label={t("nftDetail.galleryLabel")} className="w-full">
      <div className="flex flex-col-reverse gap-4 md:flex-row">
        <div
          className="flex gap-3 md:w-24 md:flex-col md:shrink-0"
          role="listbox"
          aria-label={t("nftDetail.galleryLabel")}
        >
          {images.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              role="option"
              aria-selected={i === selectedIndex}
              aria-label={t("nftDetail.thumbnailLabel", {
                index: i + 1,
                total: images.length,
              })}
              onClick={() => selectImage(i)}
              className={cn(
                "overflow-hidden rounded-lg border-2 transition-colors",
                i === selectedIndex
                  ? "border-primary"
                  : "border-transparent hover:border-primary/40"
              )}
            >
              <img
                className="aspect-square w-20 object-cover md:w-full"
                src={image}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl border border-border bg-surface">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={alt}
              className="h-full w-full object-cover"
            />
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden lg:flex absolute right-3 top-3 h-9 w-9 rounded-full bg-background/60 text-foreground hover:bg-background/80"
            aria-label={t("nftDetail.zoomImage")}
            onClick={openZoom}
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <Dialog
        open={isZoomOpen}
        onOpenChange={(open) => (open ? openZoom() : closeZoom())}
      >
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">
            {t("nftDetail.zoomDialogTitle", { name: alt })}
          </DialogTitle>
          <img
            src={selectedImage}
            alt={alt}
            className="max-h-[80vh] w-full rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
