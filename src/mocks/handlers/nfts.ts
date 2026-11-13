// MSW Handlers for NFTs
import { http, HttpResponse, delay } from "msw"
import {
  FEATURED_NFTS,
  CATALOG_FILTERS,
  filterNFTs,
  paginateNFTs,
  getNFTById,
} from "@/mocks/data/nfts"
import type { NFTListParams } from "@/types/nft"

// Configurable delay for testing loading states
let requestDelay = 0
let shouldFail = false
let failStatus = 500
let outOfOrder = false

export function setMockConfig(config: {
  delay?: number
  shouldFail?: boolean
  failStatus?: number
  outOfOrder?: boolean
}) {
  if (config.delay !== undefined) requestDelay = config.delay
  if (config.shouldFail !== undefined) shouldFail = config.shouldFail
  if (config.failStatus !== undefined) failStatus = config.failStatus
  if (config.outOfOrder !== undefined) outOfOrder = config.outOfOrder
}

export function resetMockConfig() {
  requestDelay = 0
  shouldFail = false
  failStatus = 500
  outOfOrder = false
}

// Simulate out-of-order responses
let requestCounter = 0

async function maybeDelay() {
  if (requestDelay > 0) {
    await delay(requestDelay)
  }
}

// Handler functions reusable for both "/api/nfts*" and "/nfts*"
const handleListNFTs = async ({ request }: { request: Request }) => {
  await maybeDelay()

  const url = new URL(request.url)
  const pageParam = url.searchParams.get("page")
  const limitParam = url.searchParams.get("limit")
  const page = parseInt(pageParam || "1", 10)
  const limit = parseInt(limitParam || "8", 10)

  // Validate page
  const validatedPage = page < 1 ? 1 : page

  // Extract filter params
  const filterParams = {
    q: url.searchParams.get("q") || undefined,
    category: url.searchParams.get("category") || undefined,
    collection: url.searchParams.get("collection") || undefined,
    minPrice: url.searchParams.get("minPrice") || undefined,
    maxPrice: url.searchParams.get("maxPrice") || undefined,
    network: url.searchParams.get("network") || undefined,
    sort: (url.searchParams.get("sort") as NFTListParams["sort"]) || "recent",
    tab: (url.searchParams.get("tab") as NFTListParams["tab"]) || "all",
  }

  if (shouldFail) {
    return HttpResponse.json({ message: "Internal Server Error" }, { status: failStatus })
  }

  const filtered = filterNFTs(filterParams)
  const result = paginateNFTs(filtered, validatedPage, limit)

  // Simulate out-of-order: return a delayed response for the previous request
  if (outOfOrder) {
    requestCounter++
    const currentRequest = requestCounter
    if (currentRequest % 2 === 1) {
      const stalePage = Math.max(1, validatedPage - 1)
      const staleFiltered = filterNFTs(filterParams)
      const staleResult = paginateNFTs(staleFiltered, stalePage, limit)
      return HttpResponse.json(staleResult)
    }
  }

  return HttpResponse.json(result)
}

const handleFeaturedNFTs = async () => {
  await maybeDelay()

  if (shouldFail) {
    return HttpResponse.json({ message: "Internal Server Error" }, { status: failStatus })
  }

  return HttpResponse.json({ data: FEATURED_NFTS })
}

const handleCatalogFilters = async () => {
  await maybeDelay()

  if (shouldFail) {
    return HttpResponse.json({ message: "Internal Server Error" }, { status: failStatus })
  }

  return HttpResponse.json(CATALOG_FILTERS)
}

const handleNFTById = async ({ params }: { params: Record<string, string | readonly string[] | undefined> }) => {
  await maybeDelay()

  if (shouldFail) {
    return HttpResponse.json({ message: "Internal Server Error" }, { status: failStatus })
  }

  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const nft = getNFTById(id as string)
  if (!nft) {
    return HttpResponse.json({ message: "NFT not found" }, { status: 404 })
  }

  return HttpResponse.json(nft)
}

export const nftHandlers = [
  // Intercept both /api/nfts and /nfts routes for robustness
  http.get("/api/nfts/featured", handleFeaturedNFTs),
  http.get("/nfts/featured", handleFeaturedNFTs),

  http.get("/api/nfts/filters", handleCatalogFilters),
  http.get("/nfts/filters", handleCatalogFilters),

  http.get("/api/nfts/:id", handleNFTById),
  http.get("/nfts/:id", handleNFTById),

  http.get("/api/nfts", handleListNFTs),
  http.get("/nfts", handleListNFTs),
]
