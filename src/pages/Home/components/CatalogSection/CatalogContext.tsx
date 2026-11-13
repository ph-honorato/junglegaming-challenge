import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import type { CatalogTab, SortOption } from "./components";

export interface CatalogState {
  // Search params from URL
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    network?: string;
    sort?: SortOption;
    tab?: CatalogTab;
    page?: number;
    limit?: number;
  };
  // Filter data from API
  categories: { category: string; count: number }[];
  networks: { network: string; count: number }[];
  priceRange: { min: string; max: string };
  // Local UI state
  isMobileFiltersOpen: boolean;
  minPriceInput: number;
  maxPriceInput: number;
}

type CatalogAction =
  | { type: "SET_SEARCH_PARAMS"; payload: CatalogState["searchParams"] }
  | {
      type: "SET_FILTER_DATA";
      payload: {
        categories: CatalogState["categories"];
        networks: CatalogState["networks"];
        priceRange: CatalogState["priceRange"];
      };
    }
  | { type: "SET_MOBILE_FILTERS_OPEN"; payload: boolean }
  | { type: "SET_MIN_PRICE_INPUT"; payload: number }
  | { type: "SET_MAX_PRICE_INPUT"; payload: number }
  | { type: "RESET_PRICE_INPUTS"; payload: { min: number; max: number } }
  | { type: "CLEAR_FILTERS" };

function catalogReducer(
  state: CatalogState,
  action: CatalogAction,
): CatalogState {
  switch (action.type) {
    case "SET_SEARCH_PARAMS":
      return { ...state, searchParams: action.payload };
    case "SET_FILTER_DATA":
      return {
        ...state,
        categories: action.payload.categories,
        networks: action.payload.networks,
        priceRange: action.payload.priceRange,
      };
    case "SET_MOBILE_FILTERS_OPEN":
      return { ...state, isMobileFiltersOpen: action.payload };
    case "SET_MIN_PRICE_INPUT":
      return { ...state, minPriceInput: action.payload };
    case "SET_MAX_PRICE_INPUT":
      return { ...state, maxPriceInput: action.payload };
    case "RESET_PRICE_INPUTS":
      return {
        ...state,
        minPriceInput: action.payload.min,
        maxPriceInput: action.payload.max,
      };
    case "CLEAR_FILTERS":
      return {
        ...state,
        searchParams: {
          ...state.searchParams,
          category: undefined,
          network: undefined,
          minPrice: undefined,
          maxPrice: undefined,
          page: 1,
        },
        minPriceInput: parseFloat(state.priceRange.min),
        maxPriceInput: parseFloat(state.priceRange.max),
      };
    default:
      return state;
  }
}

interface CatalogContextValue extends CatalogState {
  // Actions
  setCategory: (category: string | undefined) => void;
  setNetwork: (network: string | undefined) => void;
  setPriceRange: (min: number | undefined, max: number | undefined) => void;
  setSort: (sort: SortOption) => void;
  setTab: (tab: CatalogTab) => void;
  setPage: (page: number) => void;
  applyPriceInputs: () => void;
  clearFilters: () => void;
  toggleMobileFilters: () => void;
  closeMobileFilters: () => void;
  setIsMobileFiltersOpen: (open: boolean) => void;
  setMinPriceInput: (value: number) => void;
  setMaxPriceInput: (value: number) => void;
  hasActiveFilters: boolean;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({
  children,
  initialCategories = [],
  initialNetworks = [],
  initialPriceRange = { min: "0", max: "10" },
}: {
  children: ReactNode;
  initialCategories?: CatalogState["categories"];
  initialNetworks?: CatalogState["networks"];
  initialPriceRange?: CatalogState["priceRange"];
}) {
  const navigate = useNavigate();
  const search = useSearch({ from: "/" });

  const [state, dispatch] = useReducer(catalogReducer, {
    searchParams: {
      q: search.q as string | undefined,
      category: search.category as string | undefined,
      minPrice: search.minPrice as string | undefined,
      maxPrice: search.maxPrice as string | undefined,
      network: search.network as string | undefined,
      sort: (search.sort as SortOption) || "recent",
      tab: (search.tab as CatalogTab) || "all",
      page: parseInt((search.page as string) || "1", 10),
      limit: 8,
    },
    categories: initialCategories,
    networks: initialNetworks,
    priceRange: initialPriceRange,
    isMobileFiltersOpen: false,
    minPriceInput: search.minPrice
      ? parseFloat(search.minPrice)
      : parseFloat(initialPriceRange.min),
    maxPriceInput: search.maxPrice
      ? parseFloat(search.maxPrice)
      : parseFloat(initialPriceRange.max),
  });

  // Sync initial filter data when it arrives from API
  useEffect(() => {
    if (
      initialCategories.length > 0 ||
      initialNetworks.length > 0 ||
      initialPriceRange.min !== "0" ||
      initialPriceRange.max !== "10"
    ) {
      dispatch({
        type: "SET_FILTER_DATA",
        payload: {
          categories: initialCategories,
          networks: initialNetworks,
          priceRange: initialPriceRange,
        },
      });
    }
  }, [initialCategories, initialNetworks, initialPriceRange]);

  // Sync state when URL search changes (e.g. back/forward navigation)
  useEffect(() => {
    dispatch({
      type: "SET_SEARCH_PARAMS",
      payload: {
        q: search.q as string | undefined,
        category: search.category as string | undefined,
        minPrice: search.minPrice as string | undefined,
        maxPrice: search.maxPrice as string | undefined,
        network: search.network as string | undefined,
        sort: (search.sort as SortOption) || "recent",
        tab: (search.tab as CatalogTab) || "all",
        page: parseInt((search.page as string) || "1", 10),
        limit: 8,
      },
    });
  }, [search]);

  // Sync search params with URL
  const updateSearchParams = (
    params: Partial<CatalogState["searchParams"]>,
  ) => {
    const newParams = { ...state.searchParams, ...params };
    dispatch({ type: "SET_SEARCH_PARAMS", payload: newParams });
    navigate({
      search: newParams as any,
    });
  };

  const setCategory = (category: string | undefined) => {
    updateSearchParams({ category, page: 1 });
  };

  const setNetwork = (network: string | undefined) => {
    updateSearchParams({ network, page: 1 });
  };

  const setPriceRange = (min: number | undefined, max: number | undefined) => {
    updateSearchParams({
      minPrice: min !== undefined ? min.toFixed(4) : undefined,
      maxPrice: max !== undefined ? max.toFixed(4) : undefined,
      page: 1,
    });
  };

  const setSort = (sort: SortOption) => {
    updateSearchParams({ sort, page: 1 });
  };

  const setTab = (tab: CatalogTab) => {
    updateSearchParams({ tab: tab === "all" ? undefined : tab, page: 1 });
  };

  const setPage = (page: number) => {
    updateSearchParams({ page });
  };

  const applyPriceInputs = () => {
    setPriceRange(state.minPriceInput, state.maxPriceInput);
  };

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
    navigate({
      search: {
        q: state.searchParams.q,
        tab: state.searchParams.tab,
        sort: state.searchParams.sort,
        page: 1,
      } as any,
    });
  };

  const toggleMobileFilters = () => {
    dispatch({
      type: "SET_MOBILE_FILTERS_OPEN",
      payload: !state.isMobileFiltersOpen,
    });
  };

  const closeMobileFilters = () => {
    dispatch({ type: "SET_MOBILE_FILTERS_OPEN", payload: false });
  };

  const setIsMobileFiltersOpen = (open: boolean) => {
    dispatch({ type: "SET_MOBILE_FILTERS_OPEN", payload: open });
  };

  const setMinPriceInput = (value: number) => {
    dispatch({ type: "SET_MIN_PRICE_INPUT", payload: value });
  };

  const setMaxPriceInput = (value: number) => {
    dispatch({ type: "SET_MAX_PRICE_INPUT", payload: value });
  };

  const hasActiveFilters = !!(
    state.searchParams.category ||
    state.searchParams.network ||
    state.searchParams.minPrice ||
    state.searchParams.maxPrice
  );

  return (
    <CatalogContext.Provider
      value={{
        ...state,
        setCategory,
        setNetwork,
        setPriceRange,
        setSort,
        setTab,
        setPage,
        applyPriceInputs,
        clearFilters,
        toggleMobileFilters,
        closeMobileFilters,
        setIsMobileFiltersOpen,
        setMinPriceInput,
        setMaxPriceInput,
        hasActiveFilters,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
}
