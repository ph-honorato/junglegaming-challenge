// NFTCard Tests
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { I18nextProvider } from "react-i18next";
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
import { NFTCard } from "./NFTCard";

const mockNFT: NFT = {
  id: "nft-1",
  name: "Emerald Ape #042",
  price: 1.19,
  network: "Ethereum",
  image: "/images/nfts/placeholder-1.svg",
  collection: "Kurio Apes",
  release_date: "2024-01-01T00:00:00Z",
  isTrending: false,
};

// The router renders its matches asynchronously, so queries must await a tick
function renderCard(props: Partial<Parameters<typeof NFTCard>[0]> = {}) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <NFTCard nft={mockNFT} {...props} />,
  });
  const nftRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/nft/$id",
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, nftRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return render(
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>,
  );
}

describe("NFTCard", () => {
  it("renders a card-wide link to the NFT detail page", async () => {
    renderCard();

    const link = await screen.findByRole("link", {
      name: "Ver detalhes de Emerald Ape #042",
    });
    expect(link).toHaveAttribute("href", "/nft/nft-1");
  });

  it("renders the card content with price", async () => {
    renderCard();

    expect(await screen.findByText("Emerald Ape #042")).toBeInTheDocument();
    expect(screen.getByText("1.19 ETH")).toBeInTheDocument();
  });

  it("keeps the favorite button clickable above the card link", async () => {
    const onFavorite = vi.fn();
    renderCard({ onFavorite, isFavorite: false });

    const favoriteButton = await screen.findByRole("button", {
      name: /favoritos/i,
    });
    fireEvent.click(favoriteButton);

    expect(onFavorite).toHaveBeenCalledWith("nft-1");
  });

  it("renders a skeleton without the detail link while loading", async () => {
    renderCard({ nft: null as unknown as NFT, isLoading: true });

    await waitFor(() => {
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });
});
