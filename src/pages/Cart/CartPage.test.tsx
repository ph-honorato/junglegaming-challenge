// CartPage Tests
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { I18nextProvider } from "react-i18next";
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
import type { CartResponse } from "@/types/cart";
import CartPage from "./CartPage";

vi.mock("@/api/cart", () => ({
  fetchCart: vi.fn(),
  addCartItem: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  applyCoupon: vi.fn(),
  removeCoupon: vi.fn(),
}));

import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
} from "@/api/cart";

const mockFetchCart = vi.mocked(fetchCart);
const mockUpdateCartItem = vi.mocked(updateCartItem);
const mockRemoveCartItem = vi.mocked(removeCartItem);
const mockApplyCoupon = vi.mocked(applyCoupon);

const baseCart: CartResponse = {
  items: [
    {
      id: "cart-item-1",
      nftId: "nft-1",
      name: "Emerald Ape #042",
      image: "/images/nfts/placeholder-1.svg",
      collection: "Kurio Apes",
      tokenId: "#0001",
      edition: 4,
      maxEdition: 24,
      unitPrice: "1.19",
      quantity: 2,
      maxQuantity: 10,
      lineTotal: "2.38",
    },
    {
      id: "cart-item-2",
      nftId: "nft-2",
      name: "Violet Nomad #314",
      image: "/images/nfts/placeholder-2.svg",
      collection: "Kurio Apes",
      tokenId: "#0002",
      edition: 6,
      maxEdition: 26,
      unitPrice: "1.39",
      quantity: 6,
      maxQuantity: 10,
      lineTotal: "8.34",
    },
  ],
  summary: {
    subtotal: "10.72",
    discount: "0",
    networkFee: "0.016",
    total: "10.736",
    coupon: null,
  },
};

// Cart fixture where the item is at its availability cap (lock icon)
const cartAtMax: CartResponse = {
  ...baseCart,
  items: baseCart.items.map((item) =>
    item.id === "cart-item-1" ? { ...item, quantity: item.maxQuantity } : item,
  ),
};

const cartWithCoupon: CartResponse = {
  ...baseCart,
  summary: {
    subtotal: "10.72",
    discount: "1.072",
    networkFee: "0.016",
    total: "9.664",
    coupon: { code: "KURIO10", percent: 10, discount: "1.072" },
  },
};

const cartAfterQuantityUpdate: CartResponse = {
  ...baseCart,
  items: baseCart.items.map((item) =>
    item.id === "cart-item-1"
      ? { ...item, quantity: 3, lineTotal: "3.57" }
      : item,
  ),
  summary: {
    subtotal: "11.91",
    discount: "0",
    networkFee: "0.016",
    total: "11.926",
    coupon: null,
  },
};

const cartAfterRemove: CartResponse = {
  items: [baseCart.items[1]],
  summary: {
    subtotal: "8.34",
    discount: "0",
    networkFee: "0.016",
    total: "8.356",
    coupon: null,
  },
};

async function renderCartPage(initialUrl = "/cart") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Outlet />
      </>
    ),
  });
  const cartRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/cart",
    component: CartPage,
  });
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <div>home-page-marker</div>,
  });
  const checkoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/checkout",
    component: () => <div>checkout-page-marker</div>,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([cartRoute, homeRoute, checkoutRoute]),
    history: createMemoryHistory({ initialEntries: [initialUrl] }),
  });

  render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </I18nextProvider>,
  );

  return { router: router as Router, queryClient };
}

function getSummary() {
  return within(screen.getByRole("region", { name: "Resumo da carteira" }));
}

beforeEach(() => {
  localStorage.clear();
  mockFetchCart.mockResolvedValue(baseCart);
});

describe("CartPage", () => {
  it("renders cart items with prices and the summary", async () => {
    await renderCartPage();

    expect(await screen.findByText("Emerald Ape #042")).toBeInTheDocument();
    expect(screen.getByText("Violet Nomad #314")).toBeInTheDocument();
    expect(getSummary().getByText("10.72 ETH")).toBeInTheDocument();
    expect(getSummary().getByText("0.016 ETH")).toBeInTheDocument();
    expect(getSummary().getByText("10.736 ETH")).toBeInTheDocument();
  });

  it("shows skeletons while loading and hides content", async () => {
    mockFetchCart.mockImplementation(() => new Promise(() => {}));

    await renderCartPage();
    await screen.findByRole("region", { name: "Carrinho de NFTs" });

    // Skeletons with shimmer are rendered, content is not
    expect(
      document.querySelectorAll(".skeleton-shimmer").length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText("Emerald Ape #042")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Código promocional"),
    ).not.toBeInTheDocument();
  });

  it("shows the empty state when there are no items", async () => {
    mockFetchCart.mockResolvedValue({
      items: [],
      summary: { ...baseCart.summary, subtotal: "0", total: "0.016" },
    });

    await renderCartPage();

    expect(
      await screen.findByText("Seu carrinho está vazio"),
    ).toBeInTheDocument();
  });

  it("shows the error state and retries on click", async () => {
    mockFetchCart.mockRejectedValueOnce(new Error("boom"));
    mockFetchCart.mockResolvedValue(baseCart);

    await renderCartPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Tentar novamente" }),
    );

    expect(await screen.findByText("Emerald Ape #042")).toBeInTheDocument();
  });

  it("updates quantity optimistically and calls the API with quantity + 1", async () => {
    mockUpdateCartItem.mockResolvedValue(cartAfterQuantityUpdate);
    await renderCartPage();

    const increaseButtons = await screen.findAllByRole("button", {
      name: "Aumentar quantidade",
    });
    fireEvent.click(increaseButtons[0]);

    await waitFor(() => {
      expect(mockUpdateCartItem).toHaveBeenCalledWith("cart-item-1", {
        quantity: 3,
      });
    });
    await screen.findByText("3.57 ETH");
  });

  it("shows a lock instead of the increase button when quantity hits the cap", async () => {
    mockFetchCart.mockResolvedValue(cartAtMax);
    await renderCartPage();

    const itemName = await screen.findByText("Emerald Ape #042");
    const row = within(itemName.closest("li") as HTMLElement);
    expect(
      row.getByLabelText("Quantidade máxima atingida"),
    ).toBeInTheDocument();
    expect(
      row.queryByRole("button", { name: "Aumentar quantidade" }),
    ).not.toBeInTheDocument();
  });

  it("removes an item and updates the summary", async () => {
    mockRemoveCartItem.mockResolvedValue(cartAfterRemove);
    await renderCartPage();

    const removeButtons = await screen.findAllByRole("button", {
      name: /Remover item/,
    });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(mockRemoveCartItem.mock.calls[0][0]).toBe("cart-item-1");
    });
    // Total reflects the single remaining item (8.34 + 0.016)
    await screen.findByText("8.356 ETH");
  });

  it("applies a valid coupon", async () => {
    mockApplyCoupon.mockResolvedValue(cartWithCoupon);
    await renderCartPage();

    fireEvent.change(await screen.findByLabelText("Código promocional"), {
      target: { value: "kurio10" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Aplicar" }));

    await waitFor(() => {
      expect(mockApplyCoupon.mock.calls[0][0]).toBe("kurio10");
    });
    await screen.findByText("KURIO10");
  });

  it("shows an inline error for an invalid coupon", async () => {
    mockApplyCoupon.mockRejectedValue({
      response: { status: 400, data: { message: "INVALID_COUPON" } },
    });
    await renderCartPage();

    fireEvent.change(await screen.findByLabelText("Código promocional"), {
      target: { value: "BOGUS" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Cupom inválido ou expirado",
    );
  });

  it("navigates to checkout when Conectar e finalizar is clicked", async () => {
    const { router } = await renderCartPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Conectar e finalizar" }),
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/checkout");
    });
    expect(screen.getByText("checkout-page-marker")).toBeInTheDocument();
  });
});
