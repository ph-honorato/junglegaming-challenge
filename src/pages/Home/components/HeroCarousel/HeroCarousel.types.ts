// HeroCarousel Types
import type { NFT } from "@/types/nft"

export interface HeroCarouselProps {
  items: NFT[]
  className?: string
  autoplay?: boolean
  interval?: number
}