"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CarouselProps {
  items: React.ReactNode[]
  className?: string
  autoplay?: boolean
  interval?: number
}

export function Carousel({ items, className, autoplay = false, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [direction, setDirection] = React.useState<"next" | "prev">("next")
  const itemsRef = React.useRef(items)

  itemsRef.current = items

  React.useEffect(() => {
    if (!autoplay) return
    const timer = setInterval(() => {
      setDirection("next")
      setCurrentIndex((prev) => (prev + 1) % itemsRef.current.length)
    }, interval)
    return () => clearInterval(timer)
  }, [autoplay, interval])

  const goToNext = () => {
    setDirection("next")
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const goToPrev = () => {
    setDirection("prev")
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "flex transition-transform duration-500 ease-out",
          direction === "next" ? "translate-x-[-100%]" : "translate-x-[100%]"
        )}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="flex-shrink-0 w-full">
            {item}
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
        onClick={goToPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentIndex ? "bg-foreground" : "bg-muted-foreground/50 hover:bg-muted-foreground"
            )}
            onClick={() => {
              setDirection(index > currentIndex ? "next" : "prev")
              setCurrentIndex(index)
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}