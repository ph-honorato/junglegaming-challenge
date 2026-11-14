// Home Page - Main Entry Point
import { useNFTs, useFeaturedNFTs, useCatalogFilters } from "@/hooks/useNFTs";
import {
  HeroCarousel,
  CatalogSection,
  CatalogProvider,
  MobileSearchBar,
  CreatorsSection,
  BlogSection,
} from "./components";
import { useSearch, useNavigate } from "@tanstack/react-router";
import * as React from "react";

export function HomePage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/" });

  // Parse search params
  const params = {
    q: search.q as string | undefined,
    category: search.category as string | undefined,
    minPrice: search.minPrice as string | undefined,
    maxPrice: search.maxPrice as string | undefined,
    network: search.network as string | undefined,
    sort:
      (search.sort as "recent" | "price_asc" | "price_desc" | "popular") ||
      "recent",
    tab: (search.tab as "all" | "new" | "trending") || "all",
    page: parseInt((search.page as string) || "1", 10),
    limit: 8,
  };

  // Fetch data
  const nftsQuery = useNFTs(params);
  const { data: featuredData } = useFeaturedNFTs();
  const { data: filtersData } = useCatalogFilters();
  const nftsData = nftsQuery.data;
  const nftsLoading = nftsQuery.isLoading;
  const nftsError = nftsQuery.isError;

  // Favorites state (in real app, this would come from auth context)
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  const handleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    const params = { ...search, page };
    navigate({ search: params });
  };

  return (
    <CatalogProvider
      initialCategories={filtersData?.categories}
      initialNetworks={filtersData?.networks}
      initialPriceRange={filtersData?.priceRange}
    >
      {/* Mobile Search + Filters Trigger */}
      <MobileSearchBar />

      {/* Hero Section */}
      <HeroCarousel items={featuredData?.data.slice(0, 3) || []} />

      {/* Catalog Section */}
      <CatalogSection
        nfts={nftsData?.data || []}
        isLoading={nftsLoading && (!nftsData || nftsData.data.length === 0)}
        onFavorite={handleFavorite}
        favorites={favorites}
        totalCount={nftsData?.meta?.total || 0}
        totalPages={nftsData?.meta?.totalPages || 1}
        currentPage={nftsData?.meta?.page || 1}
        onPageChange={handlePageChange}
        isError={nftsError}
      />

      {/* Creators Section */}
      <CreatorsSection />

      {/* Learn / Blog Section */}
      <BlogSection />
    </CatalogProvider>
  );
}

export default HomePage;
