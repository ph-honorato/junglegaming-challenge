export type NetworkType = "Ethereum" | "Polygon" | "Solana";

export interface NFT {
  id: string;
  name: string;
  price: number;
  network: NetworkType;
  image: string; // path to the created .svgs on public/images folder (e.g. /images/nfts/placeholder-1.svg)
  collection: string;
  release_date: string; // ISO date string
  isTrending: boolean;
  description?: string;
  category?: string;
  creator?: string;
  creatorAvatar?: string;
  originalPrice?: number;
  currency?: string;
  edition?: number;
  maxEdition?: number;
  isFeatured?: boolean;
  isNewRelease?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NFTListParams {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  network?: string;
  sort?: "recent" | "price_asc" | "price_desc" | "popular";
  tab?: "all" | "new" | "trending";
  page?: number;
  limit?: number;
}

export interface NFTListResponse {
  data: NFT[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FeaturedNFTsResponse {
  data: NFT[];
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface NetworkCount {
  network: NetworkType | string;
  count: number;
}

export interface PriceRange {
  min: string;
  max: string;
}

export interface CatalogFiltersResponse {
  categories: CategoryCount[];
  networks: NetworkCount[];
  priceRange: PriceRange;
}
