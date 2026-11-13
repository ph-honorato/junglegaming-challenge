// NFT Mock Data Fixtures
import type {
  NFT,
  NFTListResponse,
  CatalogFiltersResponse,
  CategoryCount,
  NetworkCount,
  PriceRange,
  NetworkType,
} from "@/types/nft";

const CATEGORIES = [
  "Arte Digital",
  "Colecionáveis",
  "Música",
  "Fotografia",
  "Vídeo",
  "Domínios",
  "Mundos Virtuais",
  "Esportes",
  "Utilidade",
] as const;

const NETWORKS: readonly NetworkType[] = [
  "Ethereum",
  "Polygon",
  "Solana",
] as const;

const CREATORS = [
  {
    name: "Alexandra Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexandra",
  },
  {
    name: "Marcus Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
  },
  {
    name: "Sofia Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia",
  },
  {
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
  },
  {
    name: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
  },
  {
    name: "Carlos Silva",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
  },
  {
    name: "Yuki Tanaka",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki",
  },
  {
    name: "Priya Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
  },
];

const NFT_IMAGES = [
  "/images/nfts/placeholder-1.svg",
  "/images/nfts/placeholder-2.svg",
  "/images/nfts/placeholder-3.svg",
  "/images/nfts/placeholder-4.svg",
  "/images/nfts/placeholder-5.svg",
  "/images/nfts/placeholder-6.svg",
  "/images/nfts/placeholder-7.svg",
  "/images/nfts/placeholder-8.svg",
];

function generateNFTs(): NFT[] {
  const nfts: NFT[] = [];
  const baseDate = new Date("2024-01-01");

  for (let i = 1; i <= 60; i++) {
    const category = CATEGORIES[(i - 1) % CATEGORIES.length];
    const network = NETWORKS[(i - 1) % NETWORKS.length];
    const creator = CREATORS[(i - 1) % CREATORS.length];
    const edition = ((i * 3) % 50) + 1;
    const maxEdition = edition + 20;
    const price = Number((((i * 0.15 + 0.1) % 4.5) + 0.05).toFixed(4));
    const hasDiscount = i % 3 === 0;
    const originalPrice = hasDiscount
      ? Number((price * 1.25).toFixed(4))
      : undefined;
    const createdAt = new Date(
      baseDate.getTime() + i * 5 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const updatedAt = createdAt;
    const release_date = createdAt;

    nfts.push({
      id: `nft-${i}`,
      name: `${category} #${i}`,
      description: `A unique ${category.toLowerCase()} piece from ${creator.name}. This NFT represents ownership of a digital asset on the ${network} blockchain.`,
      image: NFT_IMAGES[(i - 1) % NFT_IMAGES.length],
      collection: `${category} Collection`,
      category,
      creator: creator.name,
      creatorAvatar: creator.avatar,
      price,
      originalPrice,
      currency: "ETH",
      network,
      edition,
      maxEdition,
      isFeatured: i <= 8,
      isNewRelease: i > 45,
      isTrending: i % 4 === 0,
      release_date,
      createdAt,
      updatedAt,
    });
  }

  // Sort by release date descending
  return nfts.sort(
    (a, b) =>
      new Date(b.release_date).getTime() - new Date(a.release_date).getTime(),
  );
}

export const ALL_NFTS = generateNFTs();

// Featured NFTs (first 8)
export const FEATURED_NFTS = ALL_NFTS.filter((nft) => nft.isFeatured).slice(
  0,
  8,
);

// Category counts
export const CATEGORY_COUNTS: CategoryCount[] = CATEGORIES.map((category) => ({
  category,
  count: ALL_NFTS.filter((nft) => nft.category === category).length,
}));

// Network counts
export const NETWORK_COUNTS: NetworkCount[] = NETWORKS.map((network) => ({
  network,
  count: ALL_NFTS.filter((nft) => nft.network === network).length,
}));

// Price range
const prices = ALL_NFTS.map((nft) => nft.price);
export const PRICE_RANGE: PriceRange = {
  min: Math.min(...prices).toFixed(4),
  max: Math.max(...prices).toFixed(4),
};

export const CATALOG_FILTERS: CatalogFiltersResponse = {
  categories: CATEGORY_COUNTS,
  networks: NETWORK_COUNTS,
  priceRange: PRICE_RANGE,
};

// Helper to filter NFTs based on params
export function filterNFTs(params: {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  network?: string;
  sort?: "recent" | "price_asc" | "price_desc" | "popular";
  tab?: "all" | "new" | "trending";
}): NFT[] {
  let result = [...ALL_NFTS];

  if (params.q) {
    const query = params.q.toLowerCase();
    result = result.filter(
      (nft) =>
        nft.name.toLowerCase().includes(query) ||
        nft.collection.toLowerCase().includes(query) ||
        (nft.creator && nft.creator.toLowerCase().includes(query)) ||
        (nft.category && nft.category.toLowerCase().includes(query)),
    );
  }

  if (params.category) {
    result = result.filter((nft) => nft.category === params.category);
  }

  if (params.minPrice) {
    const min = parseFloat(params.minPrice);
    if (!isNaN(min)) {
      result = result.filter((nft) => nft.price >= min);
    }
  }

  if (params.maxPrice) {
    const max = parseFloat(params.maxPrice);
    if (!isNaN(max)) {
      result = result.filter((nft) => nft.price <= max);
    }
  }

  if (params.network) {
    result = result.filter(
      (nft) => nft.network.toLowerCase() === params.network!.toLowerCase(),
    );
  }

  if (params.tab === "new") {
    result = result.filter((nft) => nft.isNewRelease);
  } else if (params.tab === "trending") {
    result = result.filter((nft) => nft.isTrending);
  }

  // Sort
  switch (params.sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      result.sort((a, b) => {
        if (a.isTrending !== b.isTrending) {
          return a.isTrending ? -1 : 1;
        }
        return (b.edition || 0) - (a.edition || 0);
      });
      break;
    case "recent":
    default:
      result.sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime(),
      );
      break;
  }

  return result;
}

export function paginateNFTs(
  nfts: NFT[],
  page: number,
  limit: number,
): NFTListResponse {
  const total = nfts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = nfts.slice(start, start + limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

export function getNFTById(id: string): NFT | undefined {
  return ALL_NFTS.find((nft) => nft.id === id);
}
