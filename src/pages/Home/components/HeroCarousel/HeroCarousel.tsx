// HeroCarousel Component (Home-specific)
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px] py-4">
      {/* Left Column: Text & CTA */}
      <div className="lg:col-span-7 flex flex-col justify-center animate-slide-in pl-4">
        <span className="text-sm font-semibold">{t("home.hero.eyebrow")}</span>

        <h2
          id="hero-heading"
          className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground leading-[1.08] uppercase font-sans"
        >
          {t("home.hero.headline")}
        </h2>

        <p className="text-base md:text-sm text-muted-foreground mb-8 max-w-xl leading-relaxed">
          {t("home.hero.description")}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
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
        <div className="relative w-full max-w-[380px] lg:max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-border bg-card shadow-2xl group">
          <img
            src={item.image}
            alt={`${item.name} by ${item.creator}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Subtle vignette border inside image */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
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
          showArrows={true}
          showDots={true}
        />
      </div>
    </section>
  );
}
