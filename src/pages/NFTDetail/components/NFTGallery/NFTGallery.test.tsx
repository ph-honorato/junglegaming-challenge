// NFTGallery Unit Tests
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import "@testing-library/jest-dom"
import { I18nextProvider } from "react-i18next"
import i18n from "@/i18n"
import { NFTGallery } from "./NFTGallery"

const mockImages = [
  "https://picsum.photos/seed/gallery-1/800/800",
  "https://picsum.photos/seed/gallery-2/800/800",
  "https://picsum.photos/seed/gallery-3/800/800",
  "https://picsum.photos/seed/gallery-4/800/800",
]

const ALT = "Cosmic Dream"

function renderWithProviders(images = mockImages, alt = ALT) {
  return render(
    <I18nextProvider i18n={i18n}>
      <NFTGallery images={images} alt={alt} />
    </I18nextProvider>
  )
}

describe("NFTGallery", () => {
  it("renders the main image with the given alt", () => {
    renderWithProviders()
    const mainImage = screen.getByAltText(ALT)
    expect(mainImage).toBeInTheDocument()
    expect(mainImage).toHaveAttribute("src", mockImages[0])
  })

  it("renders 4 thumbnail buttons when given 4 images", () => {
    renderWithProviders()
    for (let i = 1; i <= 4; i++) {
      expect(
        screen.getByRole("option", { name: `Ver imagem ${i} de 4` })
      ).toBeInTheDocument()
    }
  })

  it("selects the clicked thumbnail", () => {
    renderWithProviders()
    const first = screen.getByRole("option", { name: "Ver imagem 1 de 4" })
    const second = screen.getByRole("option", { name: "Ver imagem 2 de 4" })

    expect(first).toHaveAttribute("aria-selected", "true")
    expect(second).toHaveAttribute("aria-selected", "false")

    fireEvent.click(second)

    expect(second).toHaveAttribute("aria-selected", "true")
    expect(first).toHaveAttribute("aria-selected", "false")
    expect(screen.getByAltText(ALT)).toHaveAttribute("src", mockImages[1])
  })

  it("opens the zoom dialog when the zoom button is clicked", async () => {
    renderWithProviders()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Ampliar imagem" }))

    expect(await screen.findByRole("dialog")).toBeInTheDocument()
  })

  it("renders the main container without an img when images is empty", () => {
    renderWithProviders([])
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
    expect(screen.queryByRole("option")).not.toBeInTheDocument()
  })

  it("clamps the selection when the images list shrinks", () => {
    const { rerender } = renderWithProviders()
    fireEvent.click(screen.getByRole("option", { name: "Ver imagem 4 de 4" }))
    expect(screen.getByAltText(ALT)).toHaveAttribute("src", mockImages[3])

    rerender(
      <I18nextProvider i18n={i18n}>
        <NFTGallery images={mockImages.slice(0, 2)} alt={ALT} />
      </I18nextProvider>
    )

    expect(screen.getByAltText(ALT)).toHaveAttribute("src", mockImages[1])
    expect(screen.getByRole("option", { name: "Ver imagem 2 de 2" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })
})
