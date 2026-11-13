import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui";
import * as React from "react";

export interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  autoplay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
}

export function Carousel<T>({
  items,
  renderItem,
  className,
  autoplay = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
}: CarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<"next" | "prev">("next");
  const itemsRef = React.useRef(items);

  itemsRef.current = items;

  React.useEffect(() => {
    if (!autoplay || items.length <= 1) return;
    const timer = setInterval(() => {
      setDirection("next");
      setCurrentIndex((prev) => (prev + 1) % itemsRef.current.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, items.length]);

  const goToNext = () => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrev = () => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(index);
  };

  if (items.length === 0) return null;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "flex transition-transform duration-700 ease-out",
          direction === "next" ? "translate-x-[-100%]" : "translate-x-[100%]",
        )}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        aria-roledescription="carousel"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {showArrows && items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80"
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
      {showDots && items.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
          role="tablist"
          aria-label="Slides"
        >
          {items.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Slide ${index + 1}`}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-foreground w-8"
                  : "bg-muted-foreground/50 hover:bg-muted-foreground",
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
