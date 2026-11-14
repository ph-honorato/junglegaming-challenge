import { test, expect, type Page } from "@playwright/test";

test.describe("NFT Marketplace - Critical Flows", () => {
  // Teste para verificar o carregamento da home e a navegação para os detalhes do NFT
  test("should load home page and navigate to NFT details", async ({
    page,
  }) => {
    // Navega para a página inicial
    await page.goto("/");

    // Garante que texto "KURIO" apareceu na tela
    await expect(page.locator('[data-testid="logo"]').first()).toBeVisible({
      timeout: 10000,
    });

    // Clica no primeiro card de NFT disponível no catálogo
    const firstNftCard = page.locator('[data-testid="nft-card"]').first();
    await firstNftCard.click();

    // Valida se a rota mudou corretamente para a página de detalhes do NFT
    await page.waitForURL(/\/nft\/nft-[a-zA-Z0-9-]+/, { timeout: 10000 });

    // Verifica se os bloco de detalhes da nft está visível
    await expect(
      page.locator('[data-testid="nft-details"]').first(),
    ).toBeVisible({
      timeout: 10000,
    });

    // Valida se a tela possui imagem, preço e o botão comprar visíveis
    await expect(
      page.locator('[data-testid="nft-details"] img').first(),
    ).toBeVisible();
    await expect(page.locator("text=/ETH|R\\$|\\$/i").first()).toBeVisible();
    const buyButton = page.locator('button:has-text("COMPRAR")').first();
    await expect(buyButton).toBeVisible();
  });
});

// Simulated login through the UI, working on desktop and mobile layouts
async function loginViaUi(page: Page) {
  await page.goto("/");
  await expect(page.locator('[data-testid="logo"]').first()).toBeVisible({
    timeout: 10000,
  });

  const loginButton = page.getByRole("button", { name: "Entrar" }).first();
  if (await loginButton.isVisible()) {
    await loginButton.click();
  } else {
    // Mobile: the login action lives inside the hamburger menu
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.getByRole("button", { name: "Entrar" }).first().click();
  }

  await page.waitForURL(/\/login/, { timeout: 10000 });
  await page.getByRole("button", { name: "Simular login" }).click();
  await page.waitForURL("/", { timeout: 10000 });
}

test.describe("Cart flow - details page to checkout", () => {
  test.beforeEach(async ({ page }) => {
    // Each test starts isolated: fresh cart state and no session.
    // Clear once here (not via addInitScript, which would also wipe
    // the state on the reload used by the persistence assertion).
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("kurio:cart-state");
      localStorage.removeItem("isLogged");
    });
  });

  test("buying from the details page adds the NFT and opens the cart", async ({
    page,
  }) => {
    // 1. Log in through the simulated UI flow
    await loginViaUi(page);

    // 2. Open an NFT details page from the catalog
    await page.locator('[data-testid="nft-card"]').first().click();
    await page.waitForURL(/\/nft\/nft-[a-zA-Z0-9-]+/, { timeout: 10000 });

    const nftName = await page.locator("h1").first().textContent();
    expect(nftName?.trim()).toBeTruthy();

    // 3. Click COMPRAR
    await page.locator('button:has-text("COMPRAR")').first().click();

    // 4. Redirected to the cart page
    await page.waitForURL(/\/cart/, { timeout: 10000 });

    // 5. The cart is loaded with the NFT that was just bought
    await expect(page.getByText("Resumo da carteira")).toBeVisible();
    await expect(page.getByText(nftName!.trim()).first()).toBeVisible();

    // 6. The cart persists after a refresh
    await page.reload();
    await expect(page.getByText("Resumo da carteira")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(nftName!.trim()).first()).toBeVisible();
  });

  test("buying while logged out asks for login and resumes to the cart", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator('[data-testid="logo"]').first()).toBeVisible({
      timeout: 10000,
    });

    // 1. Open details and buy while logged out
    await page.locator('[data-testid="nft-card"]').first().click();
    await page.waitForURL(/\/nft\/nft-[a-zA-Z0-9-]+/, { timeout: 10000 });
    await page.locator('button:has-text("COMPRAR")').first().click();

    // 2. Sent to the login page to authenticate
    await page.waitForURL(/\/login/, { timeout: 10000 });

    // 3. After the simulated login, the user resumes to the cart
    await page.getByRole("button", { name: "Simular login" }).click();
    await page.waitForURL(/\/cart/, { timeout: 10000 });
    await expect(page.getByText("Resumo da carteira")).toBeVisible();
  });
});
