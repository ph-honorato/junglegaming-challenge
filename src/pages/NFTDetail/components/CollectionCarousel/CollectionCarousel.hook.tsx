// CollectionCarousel data hook
import { useNFTs } from "@/hooks/useNFTs";

const PAGE_SIZE = 5;
const FETCH_LIMIT = 15;

// Splits a flat list into fixed-size pages; the last page may be smaller
export function chunkIntoPages<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

export function useCollectionNFTs(collection: string) {
  const { data, isLoading } = useNFTs({ collection, limit: FETCH_LIMIT });

  const nfts = data?.data ?? [];
  const pages = chunkIntoPages(nfts, PAGE_SIZE);

  return { pages, isLoading };
}
