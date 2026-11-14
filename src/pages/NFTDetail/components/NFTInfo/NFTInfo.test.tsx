// NFTInfo Unit Tests
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { NFTInfo } from "./NFTInfo";
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
import type { Router } from "@tanstack/react-router";
import i18n from "@/i18n";
import type { NFT } from "@/types/nft";
import type { CartResponse } from "@/types/cart";

vi.mock("@/api/cart", () => ({
  fetchCart: vi.fn(),
  addCartItem: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  applyCoupon: vi.fn(),
  removeCoupon: vi.fn(),
}));

import { addCartItem } from "@/api/cart";

const mockAddCartItem = vi.mocked(addCartItem);

const emptyCart: CartResponse = {
  items: [],
  summary: {
    subtotal: "0",
    discount: "0",
    networkFee: "0.016",
    total: "0.016",
    coupon: null,
  },
};

// Mock reviews (19 collector reviews)
const mockReviews = Array.from({ length: 19 }, (_, i) => ({
  id: `review-${i + 1}`,
  user: `Collector ${i + 1}`,
  rating: 5,
  date: "2024-02-01T00:00:00Z",
  comment: "Peça incrível, superou as expectativas!",
}));

// Mock NFT data
const mockNFT: NFT = {
  id: "nft-1",
  name: "Emerald Ape #042",
  description: "Um ape esmeralda raro da coleção Kurio Apes.",
  image: "/images/nfts/placeholder-1.svg",
  collection: "Kurio Apes",
  price: 1.19,
  network: "Ethereum",
  release_date: "2024-01-01T00:00:00Z",
  isTrending: false,
  maxEdition: 3,
  rating: 4.8,
  tokenId: "#0042",
  attributes: ["Óculos", "Esmeralda", "Raro"],
  editionStatus: "ABERTA",
  editions: ["1/1", "1/16", "1/50"],
  reviews: mockReviews,
};

// Builds a stub router so useNavigate has a proper context in every render
function createStubRouter(nft: NFT, initialPath: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <NFTInfo nft={nft} />
        <Outlet />
      </>
    ),
  });
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <div>home-page-marker</div>,
  });
  const cartRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/cart",
    component: () => <div>cart-page-marker</div>,
  });
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: () => <div>login-page-marker</div>,
  });
  return createRouter({
    routeTree: rootRoute.addChildren([homeRoute, cartRoute, loginRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
}

async function renderWithProviders(nft: NFT = mockNFT) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = createStubRouter(nft, "/");
  // Resolve the initial navigation before mounting so the first render is final
  await router.load();
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

// Renders NFTInfo over stub routes so buy navigation can be asserted
async function renderWithRouter(nft: NFT = mockNFT) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = createStubRouter(nft, "/nft/nft-1");

  render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </I18nextProvider>,
  );

  await screen.findByRole("button", { name: "COMPRAR" });
  return { router: router as Router };
}

beforeEach(() => {
  localStorage.clear();
  mockAddCartItem.mockReset();
  mockAddCartItem.mockResolvedValue(emptyCart);
});

describe("NFTInfo", () => {
  it("renders name, price and collector reviews count", async () => {
    await renderWithProviders();
    expect(
      screen.getByRole("heading", { level: 1, name: "Emerald Ape #042" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("1.19 ETH").length).toBeGreaterThan(0);
    expect(
      screen.getByText("19 avaliações de colecionadores"),
    ).toBeInTheDocument();
  });

  it("renders rating with accessible label on desktop and mobile variants", async () => {
    await renderWithProviders();
    // Desktop stars group and mobile rating pill share the same accessible label
    expect(
      screen.getAllByRole("img", {
        name: "Avaliação média de 4.8 de 5 estrelas",
      }),
    ).toHaveLength(2);
    // Mobile rating pill shows the rating value and review count
    expect(screen.getAllByText("4.8").length).toBeGreaterThan(0);
    expect(screen.getByText("(19)")).toBeInTheDocument();
  });

  it("renders buy and favorite buttons and buy stays inert when logged out", async () => {
    await renderWithProviders();
    const buyButton = screen.getByRole("button", { name: "COMPRAR" });
    const favoriteButton = screen.getByRole("button", { name: "Favoritar" });
    expect(buyButton).toBeInTheDocument();
    expect(favoriteButton).toBeInTheDocument();
    expect(() => fireEvent.click(buyButton)).not.toThrow();
    expect(() => fireEvent.click(favoriteButton)).not.toThrow();
    expect(mockAddCartItem).not.toHaveBeenCalled();
  });

  it("caps quantity at maxEdition on increase and at 1 on decrease", async () => {
    await renderWithProviders();
    // Quantity stepper renders twice (desktop row + mobile purchase bar)
    const increaseButtons = screen.getAllByRole("button", {
      name: "Aumentar quantidade",
    });
    const decreaseButtons = screen.getAllByRole("button", {
      name: "Diminuir quantidade",
    });
    const quantities = screen.getAllByLabelText("Quantidade");
    expect(quantities).toHaveLength(2);

    // Increase 5 times: clamped at maxQuantity (3)
    for (let i = 0; i < 5; i += 1) {
      fireEvent.click(increaseButtons[0]);
    }
    quantities.forEach((quantity) => expect(quantity).toHaveTextContent("3"));

    // Decrease until the floor: clamped at 1
    for (let i = 0; i < 5; i += 1) {
      fireEvent.click(decreaseButtons[0]);
    }
    quantities.forEach((quantity) => expect(quantity).toHaveTextContent("1"));
  });

  it("renders the mobile fixed purchase bar with buy and cart actions", async () => {
    await renderWithProviders();
    expect(
      screen.getByRole("button", { name: "Comprar NFT" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Carrinho" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Qtd.")).toBeInTheDocument();
  });

  it("highlights the last edition badge by default and moves selection on click", async () => {
    await renderWithProviders();
    const firstBadge = screen.getByRole("button", { name: "1/1" });
    const secondBadge = screen.getByRole("button", { name: "1/16" });
    const lastBadge = screen.getByRole("button", { name: "1/50" });

    expect(firstBadge).toHaveAttribute("aria-pressed", "false");
    expect(secondBadge).toHaveAttribute("aria-pressed", "false");
    expect(lastBadge).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(firstBadge);
    expect(firstBadge).toHaveAttribute("aria-pressed", "true");
    expect(lastBadge).toHaveAttribute("aria-pressed", "false");
  });

  it("renders the edition status pill", async () => {
    await renderWithProviders();
    expect(screen.getByText("ABERTA")).toBeInTheDocument();
  });

  it("renders token id, collection and attributes meta rows", async () => {
    await renderWithProviders();
    expect(screen.getByText("ID do token: #0042")).toBeInTheDocument();
    expect(screen.getByText("Coleção: Kurio Apes")).toBeInTheDocument();
    expect(
      screen.getByText("Atributos: Óculos, Esmeralda, Raro"),
    ).toBeInTheDocument();
  });

  it("renders share links with accessible names and correct hrefs", async () => {
    await renderWithProviders();

    const linkedinLink = screen.getByRole("link", {
      name: "Compartilhar no LinkedIn",
    });
    expect(linkedinLink).toHaveAttribute(
      "href",
      expect.stringContaining(
        "https://www.linkedin.com/sharing/share-offsite/?url=",
      ),
    );
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");

    const emailLink = screen.getByRole("link", {
      name: "Compartilhar por e-mail",
    });
    expect(emailLink.getAttribute("href")).toContain("mailto:");
    expect(emailLink.getAttribute("href")).toContain(
      `subject=${encodeURIComponent("Emerald Ape #042")}`,
    );

    const twitterLink = screen.getByRole("link", {
      name: "Compartilhar no X (Twitter)",
    });
    expect(twitterLink).toHaveAttribute(
      "href",
      expect.stringContaining("https://twitter.com/intent/tweet?url="),
    );
  });

  it("adds the NFT to the cart with the selected quantity and redirects to /cart when logged in", async () => {
    localStorage.setItem("isLogged", "true");
    const { router } = await renderWithRouter();

    // Pick quantity 2 before buying (desktop + mobile steppers share state)
    fireEvent.click(
      screen.getAllByRole("button", { name: "Aumentar quantidade" })[0],
    );
    fireEvent.click(screen.getByRole("button", { name: "COMPRAR" }));

    await waitFor(() => {
      expect(mockAddCartItem.mock.calls[0]?.[0]).toEqual({
        nftId: "nft-1",
        quantity: 2,
      });
    });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/cart");
    });
    expect(screen.getByText("cart-page-marker")).toBeInTheDocument();
  });

  it("redirects to login with a cart redirect and stashes the pending purchase when buying while logged out", async () => {
    const { router } = await renderWithRouter();

    // Pick quantity 2 before buying while logged out
    fireEvent.click(
      screen.getAllByRole("button", { name: "Aumentar quantidade" })[0],
    );
    fireEvent.click(screen.getByRole("button", { name: "COMPRAR" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/login");
    });
    expect(mockAddCartItem).not.toHaveBeenCalled();
    // The intended purchase survives the login redirect
    expect(
      JSON.parse(localStorage.getItem("kurio:pending-purchase") ?? "null"),
    ).toEqual({ nftId: "nft-1", quantity: 2 });
  });

  it("stays on the detail page and does not navigate when adding to cart fails", async () => {
    localStorage.setItem("isLogged", "true");
    mockAddCartItem.mockRejectedValueOnce(new Error("boom"));
    const { router } = await renderWithRouter();

    fireEvent.click(screen.getByRole("button", { name: "COMPRAR" }));

    await waitFor(() => {
      expect(mockAddCartItem).toHaveBeenCalled();
    });
    expect(router.state.location.pathname).toBe("/nft/nft-1");
    expect(screen.getByRole("button", { name: "COMPRAR" })).toBeEnabled();
  });
});
