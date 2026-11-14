// LoginPage Tests
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
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
import type { Router } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n";
import { AuthProvider } from "@/contexts/AuthContext";
import LoginPage from "./LoginPage";

vi.mock("@/api/cart", () => ({
  fetchCart: vi.fn(),
  addCartItem: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  applyCoupon: vi.fn(),
  removeCoupon: vi.fn(),
  clearCart: vi.fn(),
}));

import { clearCart, addCartItem } from "@/api/cart";

const mockClearCart = vi.mocked(clearCart);
const mockAddCartItem = vi.mocked(addCartItem);

// Renders the login page over stub routes so navigation can be asserted.
async function renderLoginPage(initialUrl = "/login") {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Outlet />
      </>
    ),
  });
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: LoginPage,
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
  const router = createRouter({
    routeTree: rootRoute.addChildren([loginRoute, homeRoute, cartRoute]),
    history: createMemoryHistory({ initialEntries: [initialUrl] }),
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </I18nextProvider>,
  );

  return { router: router as Router };
}

beforeEach(() => {
  localStorage.clear();
  mockClearCart.mockReset();
  mockClearCart.mockResolvedValue({
    items: [],
    summary: {
      subtotal: "0",
      discount: "0",
      networkFee: "0.016",
      total: "0.016",
      coupon: null,
    },
  });
  mockAddCartItem.mockReset();
  mockAddCartItem.mockResolvedValue({
    items: [],
    summary: {
      subtotal: "0",
      discount: "0",
      networkFee: "0.016",
      total: "0.016",
      coupon: null,
    },
  });
});

describe("LoginPage", () => {
  it("shows the simulate login card when logged out", async () => {
    await renderLoginPage();

    expect(
      await screen.findByRole("button", { name: "Simular login" }),
    ).toBeInTheDocument();
  });

  it("simulates login, persists isLogged and redirects to /", async () => {
    const { router } = await renderLoginPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Simular login" }),
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
    expect(screen.getByText("home-page-marker")).toBeInTheDocument();
    expect(localStorage.getItem("isLogged")).toBe("true");
  });

  it("allows logging out and erases the cart session", async () => {
    localStorage.setItem("isLogged", "true");
    localStorage.setItem(
      "kurio:cart-state",
      JSON.stringify({ items: [{ id: "cart-item-1", nftId: "nft-1", quantity: 2, maxQuantity: 10 }], coupon: null }),
    );
    await renderLoginPage();

    fireEvent.click(await screen.findByRole("button", { name: "Sair" }));

    await waitFor(() => {
      expect(localStorage.getItem("isLogged")).toBe("false");
    });
    expect(mockClearCart).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Simular login" }),
    ).toBeInTheDocument();
  });

  it("still logs out when clearing the cart fails", async () => {
    localStorage.setItem("isLogged", "true");
    mockClearCart.mockRejectedValueOnce(new Error("network down"));
    await renderLoginPage();

    fireEvent.click(await screen.findByRole("button", { name: "Sair" }));

    await waitFor(() => {
      expect(localStorage.getItem("isLogged")).toBe("false");
    });
    expect(
      screen.getByRole("button", { name: "Simular login" }),
    ).toBeInTheDocument();
  });

  it("completes a pending purchase after login and goes to the cart", async () => {
    localStorage.setItem(
      "kurio:pending-purchase",
      JSON.stringify({ nftId: "nft-1", quantity: 2 }),
    );
    await renderLoginPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Simular login" }),
    );

    await waitFor(() => {
      expect(mockAddCartItem.mock.calls[0]?.[0]).toEqual({
        nftId: "nft-1",
        quantity: 2,
      });
    });
    // The handoff is consumed and the user lands on the cart
    await waitFor(() => {
      expect(screen.getByText("cart-page-marker")).toBeInTheDocument();
    });
    expect(localStorage.getItem("kurio:pending-purchase")).toBeNull();
  });

  it("falls back to the redirect target when the pending purchase fails", async () => {
    localStorage.setItem(
      "kurio:pending-purchase",
      JSON.stringify({ nftId: "nft-1", quantity: 2 }),
    );
    mockAddCartItem.mockRejectedValueOnce(new Error("unavailable"));
    const { router } = await renderLoginPage("/login?redirect=/cart");

    fireEvent.click(
      await screen.findByRole("button", { name: "Simular login" }),
    );

    await waitFor(() => {
      expect(mockAddCartItem).toHaveBeenCalledTimes(1);
    });
    expect(localStorage.getItem("kurio:pending-purchase")).toBeNull();
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/cart");
    });
    // No retry loop: the pending purchase was consumed even on failure
    expect(mockAddCartItem).toHaveBeenCalledTimes(1);
  });

  it("goes to the redirect target without touching the cart when no purchase is pending", async () => {
    const { router } = await renderLoginPage("/login?redirect=/cart");

    fireEvent.click(
      await screen.findByRole("button", { name: "Simular login" }),
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/cart");
    });
    expect(mockAddCartItem).not.toHaveBeenCalled();
  });
});
