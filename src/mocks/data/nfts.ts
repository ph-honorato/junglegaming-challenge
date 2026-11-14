// NFT Mock Data Fixtures
import type {
  NFT,
  NFTListResponse,
  NFTReview,
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

// Detail fixture pools (used only by the NFT detail endpoint)
const REVIEW_USERS = [
  "Ana Beatriz",
  "Carlos Eduardo",
  "Mariana Lima",
  "João Pedro",
  "Fernanda Costa",
  "Rafael Souza",
  "Luiza Martins",
  "Pedro Henrique",
  "Camila Rocha",
  "Bruno Alves",
  "Juliana Pereira",
  "Thiago Santos",
  "Larissa Oliveira",
  "Gabriel Ferreira",
  "Beatriz Almeida",
  "Lucas Barbosa",
  "Amanda Ribeiro",
  "Diego Cardoso",
  "Patrícia Gomes",
  "Felipe Araújo",
] as const;

const REVIEW_COMMENTS = [
  "Arte incrível, as cores ficam ainda melhores em tela cheia.",
  "Compra tranquila e metadados verificados. Recomendo o criador.",
  "Peça única, a textura da arte é impressionante.",
  "Excelente custo-benefício para uma edição limitada.",
  "A composição transmite muita energia. Já adquiri outra da coleção.",
  "Token entregue rapidamente e com suporte excelente do criador.",
  "Uma das melhores peças da coleção. Detalhes magníficos.",
  "Gostei da arte, mas esperava mais variação nos atributos.",
  "Processo de cunhagem simples e bem documentado. Muito bom.",
  "A arte tem um movimento único. Vale cada centavo.",
] as const;

const ATTRIBUTES_POOL = [
  "Óculos",
  "Esmeralda",
  "Raro",
  "Dourado",
  "Boné",
  "Fone Verde",
  "Fundo Clássico",
  "Épico",
  "Corrente de Ouro",
  "Edição Limitada",
] as const;

const DETAIL_CONTRACT = "0x7A42fa19B2E5C7d83F9a01BbC64Df8E1A2b919E8";
const DETAIL_ROYALTIES = 5;
const DETAIL_TOKEN_STANDARD = "ERC-721";

// Extracts the numeric suffix of the NFT id (e.g. "nft-42" -> 42) to seed deterministic fixtures
function getNFTNumber(nft: NFT): number {
  const parsed = Number(nft.id.replace(/\D/g, ""));
  return Number.isNaN(parsed) || parsed === 0 ? 1 : parsed;
}

function generateReviews(nft: NFT): NFTReview[] {
  const nftNumber = getNFTNumber(nft);
  // The first NFT mirrors the reference design with 19 reviews
  const count = nftNumber === 1 ? 19 : ((nftNumber * 9) % 20) + 4;
  const releaseTime = new Date(nft.release_date).getTime();

  return Array.from({ length: count }, (_, r) => {
    const user = REVIEW_USERS[(nftNumber + r * 3) % REVIEW_USERS.length];
    const comment = REVIEW_COMMENTS[(nftNumber + r) % REVIEW_COMMENTS.length];
    const rating = 5 - ((nftNumber + r) % 3);
    const date = new Date(
      releaseTime + (r * 5 + (nftNumber % 5) + 1) * 24 * 60 * 60 * 1000,
    ).toISOString();

    return {
      id: `${nft.id}-review-${r + 1}`,
      user,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user)}`,
      rating,
      date,
      comment,
    };
  });
}

function generateAttributes(nft: NFT): string[] {
  const nftNumber = getNFTNumber(nft);
  return [0, 1, 2].map(
    (offset) => ATTRIBUTES_POOL[(nftNumber - 1 + offset) % ATTRIBUTES_POOL.length],
  );
}

function generateEditions(nftNumber: number): string[] {
  // Odd NFTs mirror the reference design (1/1, 1/16, 1/50); even ones vary for fixture diversity
  const sizes = nftNumber % 2 === 1 ? [1, 16, 50] : [1, 25, 100];
  return sizes.map((size) => `1/${size}`);
}

function generateLongDescription(nft: NFT, editions: string[]): string[] {
  const selectedEdition = editions[editions.length - 1];
  return [
    `${nft.name} é uma obra digital ${selectedEdition} finalizada à mão da coleção ${nft.collection}. Cada atributo fica armazenado nos metadados do token e verificado na ${nft.network}. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.`,
    `A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrado na rede. ${nft.creator} recebe ${DETAIL_ROYALTIES}% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.`,
  ];
}

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
  collection?: string;
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

  if (params.collection) {
    result = result.filter(
      (nft) => nft.collection.toLowerCase() === params.collection!.toLowerCase(),
    );
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
  const nft = ALL_NFTS.find((nft) => nft.id === id);
  if (!nft) return undefined;

  const nftNumber = getNFTNumber(nft);
  const reviews = generateReviews(nft);
  const editions = generateEditions(nftNumber);
  const averageRating =
    reviews.length > 0
      ? Number(
          (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1),
        )
      : undefined;

  return {
    ...nft,
    tokenId: `#${String(nftNumber).padStart(4, "0")}`,
    gallery: Array.from({ length: 4 }, () => nft.image),
    attributes: generateAttributes(nft),
    contract: DETAIL_CONTRACT,
    tokenStandard: DETAIL_TOKEN_STANDARD,
    royalties: DETAIL_ROYALTIES,
    editionStatus: "ABERTA",
    editions,
    rating: averageRating,
    longDescription: generateLongDescription(nft, editions),
    reviews,
  };
}
