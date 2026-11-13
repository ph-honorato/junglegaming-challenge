// CatalogSection Types
import type { NFT, CategoryCount, NetworkCount, PriceRange } from "@/types/nft"

export interface CatalogSectionProps {
  nfts: NFT[]
  isLoading?: boolean
  onFavorite: (id: string) => void
  favorites: Set<string>
  totalCount: number
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  isError?: boolean
  categories?: CategoryCount[]
  networks?: NetworkCount[]
  priceRange?: PriceRange
}
