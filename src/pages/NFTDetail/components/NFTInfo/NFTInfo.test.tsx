// NFTInfo Unit Tests
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"
import { NFTInfo } from "./NFTInfo"
import { I18nextProvider } from "react-i18next"
import { AuthProvider } from "@/contexts/AuthContext"
import i18n from "@/i18n"
import type { NFT } from "@/types/nft"

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}))

// Mock reviews (19 collector reviews)
const mockReviews = Array.from({ length: 19 }, (_, i) => ({
  id: `review-${i + 1}`,
  user: `Collector ${i + 1}`,
  rating: 5,
  date: "2024-02-01T00:00:00Z",
  comment: "Peça incrível, superou as expectativas!",
}))

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
}

function renderWithProviders(nft: NFT = mockNFT) {
  return render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <NFTInfo nft={nft} />
      </AuthProvider>
    </I18nextProvider>
  )
}

describe("NFTInfo", () => {
  it("renders name, price and collector reviews count", () => {
    renderWithProviders()
    expect(screen.getByRole("heading", { level: 1, name: "Emerald Ape #042" })).toBeInTheDocument()
    expect(screen.getAllByText("1.19 ETH").length).toBeGreaterThan(0)
    expect(screen.getByText("19 avaliações de colecionadores")).toBeInTheDocument()
  })

  it("renders rating with accessible label on desktop and mobile variants", () => {
    renderWithProviders()
    // Desktop stars group and mobile rating pill share the same accessible label
    expect(
      screen.getAllByRole("img", { name: "Avaliação média de 4.8 de 5 estrelas" })
    ).toHaveLength(2)
    // Mobile rating pill shows the rating value and review count
    expect(screen.getAllByText("4.8").length).toBeGreaterThan(0)
    expect(screen.getByText("(19)")).toBeInTheDocument()
  })

  it("renders buy and favorite buttons without click handlers", () => {
    renderWithProviders()
    const buyButton = screen.getByRole("button", { name: "COMPRAR" })
    const favoriteButton = screen.getByRole("button", { name: "Favoritar" })
    expect(buyButton).toBeInTheDocument()
    expect(favoriteButton).toBeInTheDocument()
    // Buttons are intentionally inert: clicking them must not throw
    expect(() => fireEvent.click(buyButton)).not.toThrow()
    expect(() => fireEvent.click(favoriteButton)).not.toThrow()
  })

  it("caps quantity at maxEdition on increase and at 1 on decrease", () => {
    renderWithProviders()
    // Quantity stepper renders twice (desktop row + mobile purchase bar)
    const increaseButtons = screen.getAllByRole("button", { name: "Aumentar quantidade" })
    const decreaseButtons = screen.getAllByRole("button", { name: "Diminuir quantidade" })
    const quantities = screen.getAllByLabelText("Quantidade")
    expect(quantities).toHaveLength(2)

    // Increase 5 times: clamped at maxQuantity (3)
    for (let i = 0; i < 5; i += 1) {
      fireEvent.click(increaseButtons[0])
    }
    quantities.forEach((quantity) => expect(quantity).toHaveTextContent("3"))

    // Decrease until the floor: clamped at 1
    for (let i = 0; i < 5; i += 1) {
      fireEvent.click(decreaseButtons[0])
    }
    quantities.forEach((quantity) => expect(quantity).toHaveTextContent("1"))
  })

  it("renders the mobile fixed purchase bar with buy and cart actions", () => {
    renderWithProviders()
    expect(screen.getByRole("button", { name: "Comprar NFT" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Carrinho" })).toBeInTheDocument()
    expect(screen.getByText("Qtd.")).toBeInTheDocument()
  })

  it("highlights the last edition badge by default and moves selection on click", () => {
    renderWithProviders()
    const firstBadge = screen.getByRole("button", { name: "1/1" })
    const secondBadge = screen.getByRole("button", { name: "1/16" })
    const lastBadge = screen.getByRole("button", { name: "1/50" })

    expect(firstBadge).toHaveAttribute("aria-pressed", "false")
    expect(secondBadge).toHaveAttribute("aria-pressed", "false")
    expect(lastBadge).toHaveAttribute("aria-pressed", "true")

    fireEvent.click(firstBadge)
    expect(firstBadge).toHaveAttribute("aria-pressed", "true")
    expect(lastBadge).toHaveAttribute("aria-pressed", "false")
  })

  it("renders the edition status pill", () => {
    renderWithProviders()
    expect(screen.getByText("ABERTA")).toBeInTheDocument()
  })

  it("renders token id, collection and attributes meta rows", () => {
    renderWithProviders()
    expect(screen.getByText("ID do token: #0042")).toBeInTheDocument()
    expect(screen.getByText("Coleção: Kurio Apes")).toBeInTheDocument()
    expect(
      screen.getByText("Atributos: Óculos, Esmeralda, Raro")
    ).toBeInTheDocument()
  })

  it("renders share links with accessible names and correct hrefs", () => {
    renderWithProviders()

    const linkedinLink = screen.getByRole("link", { name: "Compartilhar no LinkedIn" })
    expect(linkedinLink).toHaveAttribute(
      "href",
      expect.stringContaining("https://www.linkedin.com/sharing/share-offsite/?url=")
    )
    expect(linkedinLink).toHaveAttribute("target", "_blank")
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer")

    const emailLink = screen.getByRole("link", { name: "Compartilhar por e-mail" })
    expect(emailLink.getAttribute("href")).toContain("mailto:")
    expect(emailLink.getAttribute("href")).toContain(
      `subject=${encodeURIComponent("Emerald Ape #042")}`
    )

    const twitterLink = screen.getByRole("link", { name: "Compartilhar no X (Twitter)" })
    expect(twitterLink).toHaveAttribute(
      "href",
      expect.stringContaining("https://twitter.com/intent/tweet?url=")
    )
  })
})
