// HeroCarousel Unit Tests
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import "@testing-library/jest-dom"
import { HeroCarousel } from "./HeroCarousel"
import { I18nextProvider } from "react-i18next"
import i18n from "@/i18n"

// Mock NFT data
const mockNFTs = [
  {
    id: "1",
    name: "Cosmic Dream",
    description: "A journey through the stars",
    image: "https://picsum.photos/seed/1/800/600",
    creator: "Artist One",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=artist1",
    price: 0.5,
    currency: "ETH" as const,
    collection: "Cosmic Collection",
    category: "Art",
    network: "Ethereum" as const,
    edition: 1,
    totalEditions: 100,
    maxEdition: 100,
    isFavorite: false,
    isFeatured: true,
    isNewRelease: false,
    isTrending: false,
    release_date: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Digital Horizon",
    description: "Where pixels meet reality",
    image: "https://picsum.photos/seed/2/800/600",
    creator: "Artist Two",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=artist2",
    price: 1.2,
    currency: "ETH" as const,
    collection: "Digital Collection",
    category: "Art",
    network: "Polygon" as const,
    edition: 5,
    totalEditions: 50,
    maxEdition: 50,
    isFavorite: true,
    isFeatured: true,
    isNewRelease: true,
    isTrending: false,
    release_date: "2024-01-02T00:00:00Z",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
]

function renderWithProviders(items = mockNFTs, className?: string) {
  return render(
    <I18nextProvider i18n={i18n}>
      <HeroCarousel items={items} className={className} />
    </I18nextProvider>
  )
}

describe("HeroCarousel", () => {
  it("renders hero section with carousel", () => {
    renderWithProviders()
    expect(screen.getByTestId("hero-section")).toBeInTheDocument()
  })

  it("renders carousel with items", () => {
    renderWithProviders()
    // Carousel renders both slides with their respective images
    expect(screen.getByAltText("Cosmic Dream by Artist One")).toBeInTheDocument()
    expect(screen.getByAltText("Digital Horizon by Artist Two")).toBeInTheDocument()
  })

  it("renders hero headline with translation", () => {
    renderWithProviders()
    const headlines = screen.getAllByText("SEJA DONO DO FUTURO DA ARTE DIGITAL")
    expect(headlines).toHaveLength(2) // One per slide
  })

  it("renders hero description with translation", () => {
    renderWithProviders()
    const descriptions = screen.getAllByText(/Descubra, colecione e negocie NFTs exclusivos/)
    expect(descriptions).toHaveLength(2) // One per slide
  })

  it("renders explore CTA button", () => {
    renderWithProviders()
    const buttons = screen.getAllByRole("button", { name: /EXPLORAR/i })
    expect(buttons).toHaveLength(4) // One mobile link + one desktop button per slide
  })

  it("renders mobile and desktop CTA variants separately", () => {
    const { container } = renderWithProviders()
    const mobileCtas = container.querySelectorAll(".lg\\:hidden")
    const desktopCtas = container.querySelectorAll(".hidden.lg\\:flex")
    expect(mobileCtas.length).toBeGreaterThan(0)
    expect(desktopCtas.length).toBeGreaterThan(0)
  })

  it("renders slides as compact inline cards on mobile", () => {
    const { container } = renderWithProviders()
    const slideCards = container.querySelectorAll(".grid-cols-\\[1fr_auto\\]")
    expect(slideCards).toHaveLength(2) // One per slide
    slideCards.forEach((card) => {
      expect(card).toHaveClass("bg-card")
      expect(card).toHaveClass("rounded-2xl")
      expect(card).toHaveClass("lg:grid-cols-12")
    })
  })

  it("does not render a secondary CTA button", () => {
    renderWithProviders()
    const buttons = screen.queryAllByRole("button", { name: /Saiba mais/i })
    expect(buttons).toHaveLength(0)
  })

  it("renders carousel dot indicators", () => {
    renderWithProviders()
    const dots = screen.getAllByRole("tab", { name: /Slide \d+/i })
    expect(dots).toHaveLength(2)
  })

  it("applies custom className", () => {
    const { container } = renderWithProviders(mockNFTs, "test-custom-class")
    const section = container.querySelector("section")
    expect(section).toHaveClass("relative")
    expect(section).toHaveClass("py-8")
    expect(section).toHaveClass("lg:py-16")
    expect(section).toHaveClass("overflow-hidden")
    expect(section).toHaveClass("test-custom-class")
  })

  it("handles empty items array", () => {
    const { container } = renderWithProviders([])
    const section = container.querySelector("section")
    // Carousel returns null for empty items, so section exists but carousel doesn't render
    expect(section).toBeInTheDocument()
  })

  it("renders decorative floating elements on desktop", () => {
    const { container } = renderWithProviders()
    const decorativeElements = container.querySelectorAll(".hidden.lg\\:block")
    expect(decorativeElements.length).toBeGreaterThan(0)
  })

  it("renders images with lazy loading", () => {
    renderWithProviders()
    const images = screen.getAllByRole("img")
    images.forEach((img) => {
      expect(img).toHaveAttribute("loading", "lazy")
    })
  })

  it("renders eyebrow text with translation", () => {
    renderWithProviders()
    const eyebrows = screen.getAllByText("Bem-vindo à Kurio")
    expect(eyebrows).toHaveLength(2) // One per slide
  })
})