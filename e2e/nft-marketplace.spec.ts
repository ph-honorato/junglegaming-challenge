import { test, expect } from "@playwright/test";

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
