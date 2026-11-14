// LoginPage Tests
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
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
import { AuthProvider } from "@/contexts/AuthContext";
import LoginPage from "./LoginPage";

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
  const router = createRouter({
    routeTree: rootRoute.addChildren([loginRoute, homeRoute]),
    history: createMemoryHistory({ initialEntries: [initialUrl] }),
  });

  render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </I18nextProvider>,
  );

  return { router: router as Router };
}

beforeEach(() => {
  localStorage.clear();
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

  it("allows logging out when already logged in", async () => {
    localStorage.setItem("isLogged", "true");
    await renderLoginPage();

    fireEvent.click(await screen.findByRole("button", { name: "Sair" }));

    await waitFor(() => {
      expect(localStorage.getItem("isLogged")).toBe("false");
    });
    expect(
      screen.getByRole("button", { name: "Simular login" }),
    ).toBeInTheDocument();
  });
});
