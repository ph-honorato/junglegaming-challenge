import { api } from "@/lib/api"
import type { NFT, NFTListParams, NFTListResponse, FeaturedNFTsResponse, CatalogFiltersResponse } from "@/types/nft"

const NFT_ENDPOINT = "/nfts"

export async function fetchNFTs(params: NFTListParams): Promise<NFTListResponse> {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set("q", params.q)
  if (params.category) searchParams.set("category", params.category)
  if (params.collection) searchParams.set("collection", params.collection)
  if (params.minPrice) searchParams.set("minPrice", params.minPrice)
  if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice)
  if (params.network) searchParams.set("network", params.network)
  if (params.sort) searchParams.set("sort", params.sort)
  if (params.tab) searchParams.set("tab", params.tab)
  if (params.page) searchParams.set("page", params.page.toString())
  if (params.limit) searchParams.set("limit", params.limit.toString())

  const response = await api.get<NFTListResponse>(`${NFT_ENDPOINT}?${searchParams.toString()}`)
  return response.data
}

export async function fetchFeaturedNFTs(): Promise<FeaturedNFTsResponse> {
  const response = await api.get<FeaturedNFTsResponse>(`${NFT_ENDPOINT}/featured`)
  return response.data
}

export async function fetchCatalogFilters(): Promise<CatalogFiltersResponse> {
  const response = await api.get<CatalogFiltersResponse>(`${NFT_ENDPOINT}/filters`)
  return response.data
}

export async function fetchNFTById(id: string): Promise<NFT> {
  const response = await api.get<NFT>(`${NFT_ENDPOINT}/${id}`)
  return response.data
}