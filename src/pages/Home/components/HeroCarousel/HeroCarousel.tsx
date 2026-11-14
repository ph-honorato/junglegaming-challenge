// HeroCarousel Component (Home-specific)
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Carousel, Button } from "@components";
import { useTranslation } from "react-i18next";
import type { HeroCarouselProps } from "./HeroCarousel.types";

function HeroSlide({
  item,
  t,
}: {
  item: HeroCarouselProps["items"][0];
  t: ReturnType<typeof useTranslation>["t"];
}) {
  return (
    <div className="relative lg:min-h-[460px] lg:py-4">
      {/* Slide card: compact inline layout on mobile, full-width grid on desktop */}
      <div className="grid grid-cols-[1fr_auto] lg:grid-cols-12 items-center gap-4 lg:gap-12 rounded-2xl lg:rounded-none border lg:border-0 border-border bg-card lg:bg-transparent p-4 sm:p-5 lg:p-0">
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-7 flex flex-col justify-center animate-slide-in lg:pl-4 min-w-0">
          <span className="text-xs md:text-sm font-semibold">
            {t("home.hero.eyebrow")}
          </span>

          <h2
            id="hero-heading"
            className="text-lg md:text-2xl lg:text-6xl font-black tracking-tight mb-2 lg:mb-6 text-foreground leading-tight lg:leading-[1.08] uppercase font-sans"
          >
            {t("home.hero.headline")}
          </h2>

          <p className="text-xs md:text-sm lg:text-base text-muted-foreground mb-3 lg:mb-8 max-w-xl leading-relaxed line-clamp-3 lg:line-clamp-none">
            {t("home.hero.description")}
          </p>

          {/* Mobile CTA: compact text link */}
          <Button
            variant="link"
            className="lg:hidden self-start p-0 h-auto gap-2 text-primary font-bold text-sm hover:text-primary/80"
          >
            {t("common.explore").toUpperCase()}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* Desktop CTA */}
          <div className="hidden lg:flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {t("common.explore").toUpperCase()}
            </Button>
          </div>
        </div>

        {/* Right Column: Featured NFT Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-32 sm:w-40 lg:w-full lg:max-w-[420px] aspect-square rounded-xl lg:rounded-3xl overflow-hidden border border-border bg-card shadow-lg lg:shadow-2xl group">
            <img
              src={item.image}
              alt={`${item.name} by ${item.creator}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Subtle vignette border inside image */}
            <div className="absolute inset-0 rounded-xl lg:rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-8 right-8 hidden lg:block opacity-10 pointer-events-none">
        <div className="w-32 h-32 rounded-full bg-primary blur-3xl animate-pulse" />
      </div>
      <div className="absolute bottom-8 left-8 hidden lg:block opacity-10 pointer-events-none">
        <div className="w-24 h-24 rounded-full bg-primary/50 blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}

export function HeroCarousel({
  items,
  className,
  autoplay = true,
  interval = 5000,
}: HeroCarouselProps) {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      data-testid="hero-section"
      aria-labelledby="hero-heading"
      className={cn("relative py-8 lg:py-16 overflow-hidden", className)}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          items={items}
          renderItem={(item) => <HeroSlide item={item} t={t} />}
          autoplay={autoplay}
          interval={interval}
          showDots={true}
          className="pb-10 lg:pb-0"
        />
      </div>
    </section>
  );
}
