import { test, expect, type Page } from "@playwright/test";

test.describe("NFT Marketplace - Critical Flows", () => {
  // Teste para verificar o carregamento da home e a navegação para os detalhes do NFT
  test("should load home page and navigate to NFT details", async ({
    page,
  }) => {
    // Navega para a página inicial
    await page.goto("/");

    // O header (com o logo KURIO) é desktop-only: em viewports menores o
    // marcador de carregamento é a seção hero. Em desktop o logo aparece.
    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      await expect(page.locator('[data-testid="logo"]').first()).toBeVisible({
        timeout: 10000,
      });
    } else {
      await expect(
        page.locator('[data-testid="hero-section"]').first(),
      ).toBeVisible({ timeout: 10000 });
    }

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
    // Desktop and mobile render duplicated layouts: pick the first visible match
    await expect(
      page
        .locator("text=/ETH|R\\$|\\$/i")
        .filter({ visible: true })
        .first(),
    ).toBeVisible();
    const buyButton = page
      .getByRole("button", { name: /comprar/i })
      .filter({ visible: true })
      .first();
    await expect(buyButton).toBeVisible();
  });
});

// Simulated login through the UI, working on desktop and mobile layouts.
// The login page content lives in <main>, so it is reachable on every
// viewport (the header, with its Entrar shortcut, is desktop-only).
async function loginViaUi(page: Page) {
  await page.goto("/login");
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
    await page
      .getByRole("button", { name: /comprar/i })
      .filter({ visible: true })
      .first()
      .click();

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
    // Header/logo is desktop-only; the hero section marks a loaded home on smaller viewports
    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      await expect(page.locator('[data-testid="logo"]').first()).toBeVisible({
        timeout: 10000,
      });
    } else {
      await expect(
        page.locator('[data-testid="hero-section"]').first(),
      ).toBeVisible({ timeout: 10000 });
    }

    // 1. Open details and buy while logged out
    await page.locator('[data-testid="nft-card"]').first().click();
    await page.waitForURL(/\/nft\/nft-[a-zA-Z0-9-]+/, { timeout: 10000 });
    const nftName = await page.locator("h1").first().textContent();
    await page
      .getByRole("button", { name: /comprar/i })
      .filter({ visible: true })
      .first()
      .click();

    // 2. Sent to the login page to authenticate
    await page.waitForURL(/\/login/, { timeout: 10000 });

    // 3. After the simulated login, the user resumes to the cart
    await page.getByRole("button", { name: "Simular login" }).click();
    await page.waitForURL(/\/cart/, { timeout: 10000 });
    await expect(page.getByText("Resumo da carteira")).toBeVisible();

    // 4. The pending buy completed: the NFT is in the cart
    await expect(page.getByText(nftName!.trim()).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("logging out erases the cart", async ({ page }) => {
    // 1. Log in, buy an NFT and land on the cart with it
    await loginViaUi(page);
    await page.locator('[data-testid="nft-card"]').first().click();
    await page.waitForURL(/\/nft\/nft-[a-zA-Z0-9-]+/, { timeout: 10000 });
    await page
      .getByRole("button", { name: /comprar/i })
      .filter({ visible: true })
      .first()
      .click();
    await page.waitForURL(/\/cart/, { timeout: 10000 });
    await expect(page.getByText("Resumo da carteira")).toBeVisible();

    // 2. Log out through the login page (scope to main: the header also has a Sair button on desktop)
    await page.goto("/login");
    await page.getByRole("main").getByRole("button", { name: "Sair" }).click();

    // 3. Session ended: back to logged-out state
    await expect(
      page.getByRole("button", { name: "Simular login" }),
    ).toBeVisible({ timeout: 10000 });

    // 4. The cart is empty after the logout
    await page.goto("/cart");
    await expect(
      page.getByText("Seu carrinho está vazio"),
    ).toBeVisible({ timeout: 10000 });

    // 5. And it stays empty after a refresh
    await page.reload();
    await expect(
      page.getByText("Seu carrinho está vazio"),
    ).toBeVisible({ timeout: 10000 });
  });
});
