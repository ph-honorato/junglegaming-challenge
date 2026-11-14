// NFTDetailTopBar Unit Tests
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"
import { NFTDetailTopBar } from "./NFTDetailTopBar"
import { I18nextProvider } from "react-i18next"
import i18n from "@/i18n"

const historyBack = vi.fn()

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ history: { back: historyBack } }),
}))

function renderWithProviders() {
  return render(
    <I18nextProvider i18n={i18n}>
      <NFTDetailTopBar />
    </I18nextProvider>
  )
}

describe("NFTDetailTopBar", () => {
  it("renders the back and favorite buttons", () => {
    renderWithProviders()
    expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Favoritar" })).toBeInTheDocument()
  })

  it("navigates back when the back button is clicked", () => {
    renderWithProviders()
    fireEvent.click(screen.getByRole("button", { name: "Voltar" }))
    expect(historyBack).toHaveBeenCalledTimes(1)
  })
})
