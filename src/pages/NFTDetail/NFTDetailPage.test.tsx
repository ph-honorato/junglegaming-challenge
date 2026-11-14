// NFTDetailPage Tests
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import i18n from "@/i18n";
import type { NFT } from "@/types/nft";
import { NFTDetailPage } from "./NFTDetailPage";

vi.mock("@/api/nft", () => ({
  fetchNFTById: vi.fn(),
  fetchNFTs: vi
    .fn()
    .mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, limit: 15, totalPages: 0 },
    }),
  fetchFeaturedNFTs: vi.fn().mockResolvedValue({ data: [] }),
  fetchCatalogFilters: vi.fn().mockResolvedValue({
    categories: [],
    networks: [],
    priceRange: { min: "0", max: "0" },
  }),
}));

import { fetchNFTById } from "@/api/nft";

const mockFetchNFTById = vi.mocked(fetchNFTById);

const detailNFT: NFT = {
  id: "nft-1",
  name: "Emerald Ape #042",
  price: 1.19,
  network: "Ethereum",
  image: "/images/nfts/placeholder-1.svg",
  collection: "Kurio Apes",
  release_date: "2024-01-01T00:00:00Z",
  isTrending: false,
  description: "Um colecionável digital finalizado à mão da coleção Kurio.",
  tokenId: "#0042",
  gallery: [
    "/images/nfts/placeholder-1.svg",
    "/images/nfts/placeholder-1.svg",
    "/images/nfts/placeholder-1.svg",
    "/images/nfts/placeholder-1.svg",
  ],
  attributes: ["Óculos", "Esmeralda", "Raro"],
  contract: "0x7A42fa19B2E5C7d83F9a01BbC64Df8E1A2b919E8",
  tokenStandard: "ERC-721",
  royalties: 5,
  editionStatus: "ABERTA",
  editions: ["1/1", "1/16", "1/50"],
  rating: 4.8,
  longDescription: [
    "Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Apes.",
    "A propriedade inclui a arte em alta resolução e registro de procedência na rede.",
  ],
  reviews: Array.from({ length: 19 }, (_, index) => ({
    id: `nft-1-review-${index + 1}`,
    user: `Colecionador ${index + 1}`,
    rating: 5,
    date: "2024-02-01T00:00:00Z",
    comment: "Ótima arte.",
  })),
};

const notFoundError = Object.assign(new Error("NFT not found"), {
  isAxiosError: true,
  response: { status: 404, data: { message: "NFT not found" } },
});

function renderPage(initialUrl: string) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const nftRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/nft/$id",
    component: NFTDetailPage,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([nftRoute]),
    history: createMemoryHistory({ initialEntries: [initialUrl] }),
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </I18nextProvider>,
  );
}

beforeEach(() => {
  mockFetchNFTById.mockReset();
});

describe("NFTDetailPage", () => {
  it("renders the NFT detail from the API", async () => {
    mockFetchNFTById.mockResolvedValue(detailNFT);

    renderPage("/nft/nft-1");

    expect(
      await screen.findByRole("heading", { name: "Emerald Ape #042" }),
    ).toBeInTheDocument();
    // Price renders twice: desktop info row and mobile purchase bar
    expect(screen.getAllByText("1.19 ETH")).toHaveLength(2);
    expect(
      screen.getByText("19 avaliações de colecionadores"),
    ).toBeInTheDocument();
    expect(screen.getByText("ID do token: #0042")).toBeInTheDocument();
  });

  it("renders the breadcrumb navigation", async () => {
    mockFetchNFTById.mockResolvedValue(detailNFT);

    renderPage("/nft/nft-1");

    expect(await screen.findByLabelText("Breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Mercado")).toBeInTheDocument();
  });

  it("renders the tabs with the reviews count and switches to the reviews list", async () => {
    mockFetchNFTById.mockResolvedValue(detailNFT);

    renderPage("/nft/nft-1");

    expect(
      await screen.findByRole("tab", { name: "Detalhes do NFT" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Avaliações de colecionadores (19)" }),
    ).toBeInTheDocument();

    const reviewsTab = screen.getByRole("tab", {
      name: "Avaliações de colecionadores (19)",
    });
    // Radix Tabs activates triggers on mousedown
    fireEvent.mouseDown(reviewsTab);

    expect(
      await screen.findByText("Colecionador 1"),
    ).toBeInTheDocument();
  });

  it("shows the loading skeleton while the NFT is being fetched", async () => {
    mockFetchNFTById.mockImplementation(() => new Promise(() => {}));

    renderPage("/nft/nft-1");

    expect(
      await screen.findByRole("status", { name: "Carregando NFT..." }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Emerald Ape #042")).not.toBeInTheDocument();
  });

  it("shows the not found state for an unknown NFT id", async () => {
    mockFetchNFTById.mockRejectedValue(notFoundError);

    renderPage("/nft/unknown-id");

    expect(
      await screen.findByText("NFT não encontrado"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Voltar ao mercado" }),
    ).toBeInTheDocument();
  });

  it("shows a retryable error state for unexpected failures", async () => {
    mockFetchNFTById.mockRejectedValue(new Error("Network failure"));

    renderPage("/nft/nft-1");

    expect(
      await screen.findByText("Não foi possível carregar o NFT"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tentar novamente" }),
    ).toBeInTheDocument();
  });
});
