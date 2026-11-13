// NFT Hooks using TanStack Query
import { useQuery } from "@tanstack/react-query"
import { fetchNFTs, fetchFeaturedNFTs, fetchCatalogFilters, fetchNFTById } from "@/api/nft"
import type { NFTListParams, NFTListResponse, FeaturedNFTsResponse, CatalogFiltersResponse, NFT } from "@/types/nft"

const NFT_QUERY_KEY = "nfts" as const
const FEATURED_NFTS_QUERY_KEY = "featuredNfts" as const
const CATALOG_FILTERS_QUERY_KEY = "catalogFilters" as const
const NFT_DETAIL_QUERY_KEY = "nftDetail" as const

export function useNFTs(params: NFTListParams) {
  return useQuery<NFTListResponse, Error>({
    queryKey: [NFT_QUERY_KEY, params],
    queryFn: () => fetchNFTs(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false
      }
      return failureCount < 3
    },
  })
}

export function useFeaturedNFTs() {
  return useQuery<FeaturedNFTsResponse, Error>({
    queryKey: [FEATURED_NFTS_QUERY_KEY],
    queryFn: fetchFeaturedNFTs,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  })
}

export function useCatalogFilters() {
  return useQuery<CatalogFiltersResponse, Error>({
    queryKey: [CATALOG_FILTERS_QUERY_KEY],
    queryFn: fetchCatalogFilters,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useNFTDetail(id: string | undefined) {
  return useQuery<NFT, Error>({
    queryKey: [NFT_DETAIL_QUERY_KEY, id],
    queryFn: () => fetchNFTById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  })
}

// Query key factories for invalidation
export const nftQueryKeys = {
  all: [NFT_QUERY_KEY] as const,
  lists: () => [...nftQueryKeys.all, "list"] as const,
  list: (params: NFTListParams) => [...nftQueryKeys.lists(), params] as const,
  featured: () => [FEATURED_NFTS_QUERY_KEY] as const,
  filters: () => [CATALOG_FILTERS_QUERY_KEY] as const,
  detail: (id: string) => [NFT_DETAIL_QUERY_KEY, id] as const,
}