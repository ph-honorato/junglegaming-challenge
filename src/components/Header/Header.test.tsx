// Header Tests
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
import { Header } from "./Header";

// Renders the header over stub routes that carry the home page section ids.
// The router renders its matches asynchronously, so this awaits the first paint.
async function renderHeader(initialUrl: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Header />
        <Outlet />
      </>
    ),
  });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => (
      <>
        <div id="hero" />
        <div id="catalog" />
        <div id="creators" />
        <div id="blog" />
      </>
    ),
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
  const nftRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/nft/$id",
    component: () => <div>nft-page-marker</div>,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([
      indexRoute,
      cartRoute,
      loginRoute,
      nftRoute,
    ]),
    history: createMemoryHistory({ initialEntries: [initialUrl] }),
  });

  render(
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>,
  );

  await screen.findByRole("banner");

  return { router: router as Router };
}

function getMainNav() {
  return within(
    screen.getByRole("navigation", { name: "Navegação principal" }),
  );
}

beforeEach(() => {
  vi.mocked(Element.prototype.scrollIntoView).mockClear();
});

describe("Header", () => {
  it("redirects to home when the KURIO logo is clicked from another page", async () => {
    const { router } = await renderHeader("/nft/nft-1");

    fireEvent.click(screen.getByText("KURIO"));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("navigates home and scrolls to the section when a nav item is clicked from another page", async () => {
    const { router } = await renderHeader("/nft/nft-1");

    fireEvent.click(getMainNav().getByRole("button", { name: "Mercado" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
    await waitFor(() => {
      expect(vi.mocked(Element.prototype.scrollIntoView)).toHaveBeenCalled();
    });
  });

  it("only scrolls to the section when the nav item is clicked on home", async () => {
    const { router } = await renderHeader("/");

    fireEvent.click(getMainNav().getByRole("button", { name: "Criadores" }));

    await waitFor(() => {
      expect(vi.mocked(Element.prototype.scrollIntoView)).toHaveBeenCalled();
    });
    expect(router.state.location.pathname).toBe("/");
    expect(screen.queryByText("cart-page-marker")).not.toBeInTheDocument();
  });

  it("redirects to /cart when the cart icon is clicked", async () => {
    const { router } = await renderHeader("/");

    fireEvent.click(screen.getByRole("button", { name: "Carrinho" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/cart");
    });
    expect(screen.getByText("cart-page-marker")).toBeInTheDocument();
  });

  it("redirects to /login when the login button is clicked", async () => {
    const { router } = await renderHeader("/");

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/login");
    });
    expect(screen.getByText("login-page-marker")).toBeInTheDocument();
  });
});
