// MobileSearchBar Unit Tests
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"
import { MobileSearchBar } from "./MobileSearchBar"
import { CatalogProvider, useCatalog } from "../CatalogSection"
import { I18nextProvider } from "react-i18next"
import i18n from "@/i18n"

// Stable object identity: CatalogProvider re-syncs on every useSearch() result,
// so a fresh literal per call would loop renders forever.
const mockSearch = {}

vi.mock("@tanstack/react-router", () => ({
  useSearch: () => mockSearch,
  useNavigate: () => vi.fn(),
}))

function CatalogProbe() {
  const { isMobileFiltersOpen, searchParams } = useCatalog()
  return (
    <div>
      <span data-testid="drawer-state">{String(isMobileFiltersOpen)}</span>
      <span data-testid="query-param">{searchParams.q ?? ""}</span>
    </div>
  )
}

function renderWithProviders() {
  return render(
    <I18nextProvider i18n={i18n}>
      <CatalogProvider>
        <MobileSearchBar />
        <CatalogProbe />
      </CatalogProvider>
    </I18nextProvider>
  )
}

describe("MobileSearchBar", () => {
  it("renders the search input with the collections placeholder", () => {
    renderWithProviders()
    expect(
      screen.getByPlaceholderText("Explorar coleções"),
    ).toBeInTheDocument()
  })

  it("renders the filters button", () => {
    renderWithProviders()
    expect(
      screen.getByRole("button", { name: /filtros/i }),
    ).toBeInTheDocument()
  })

  it("is hidden on desktop", () => {
    const { container } = renderWithProviders()
    expect(container.firstElementChild).toHaveClass("lg:hidden")
  })

  it("opens the catalog filters drawer when the filters button is clicked", () => {
    renderWithProviders()
    expect(screen.getByTestId("drawer-state")).toHaveTextContent("false")
    fireEvent.click(screen.getByRole("button", { name: /filtros/i }))
    expect(screen.getByTestId("drawer-state")).toHaveTextContent("true")
  })

  it("updates the query search param when the form is submitted", () => {
    renderWithProviders()
    const input = screen.getByPlaceholderText("Explorar coleções")
    fireEvent.change(input, { target: { value: "  cyber apes  " } })
    fireEvent.submit(input.closest("form")!)
    expect(screen.getByTestId("query-param")).toHaveTextContent("cyber apes")
  })

  it("clears the query when submitting an empty search", () => {
    renderWithProviders()
    const input = screen.getByPlaceholderText("Explorar coleções")
    fireEvent.change(input, { target: { value: "cyber apes" } })
    fireEvent.submit(input.closest("form")!)
    fireEvent.change(input, { target: { value: "" } })
    fireEvent.submit(input.closest("form")!)
    expect(screen.getByTestId("query-param")).toHaveTextContent("")
  })
})
