// NFTDetailTopBar Component (NFTDetail-specific)
import { ChevronLeft, Heart } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@components";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { NFTDetailTopBarProps } from "./NFTDetailTopBar.types";

export function NFTDetailTopBar({ className }: NFTDetailTopBarProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full border-border bg-card"
        aria-label={t("common.back")}
        onClick={() => router.history.back()}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </Button>

      {/* Intentionally inert: favorite flow is out of scope. */}
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full border-border bg-card"
        aria-label={t("nftDetail.favorite")}
      >
        <Heart className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
