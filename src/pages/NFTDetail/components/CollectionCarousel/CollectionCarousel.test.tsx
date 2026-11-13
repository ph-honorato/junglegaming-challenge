// CollectionCarousel Unit Tests
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

vi.mock("@/hooks/useNFTs", () => ({
  useNFTs: vi.fn(),
}));
import { useNFTs } from "@/hooks/useNFTs";
import { CollectionCarousel } from "./CollectionCarousel";
import { chunkIntoPages } from "./CollectionCarousel.hook";
import type { NFT } from "@/types/nft";

const NFT_NAMES = [
  "Cosmic Bloom #118",
  "Violet Nomad #314",
  "Nebula Drift #072",
  "Solar Mirage #511",
  "Lunar Tide #233",
  "Astral Fox #406",
  "Echo Garden #157",
  "Crimson Dune #389",
  "Velvet Comet #621",
  "Golden Ember #245",
  "Silver Grove #478",
  "Onyx Ripple #390",
];

function makeNFTs(): NFT[] {
  return NFT_NAMES.map((name, index) => ({
    id: `nft-${index + 1}`,
    name,
    price: 0.5 + index * 0.1,
    network: "Ethereum",
    image: `https://picsum.photos/seed/${index + 1}/600/600`,
    collection: "Cosmic Bloom",
    release_date: "2026-01-01T00:00:00Z",
    isTrending: false,
  }));
}

const mockMeta = { total: NFT_NAMES.length, page: 1, limit: 15, totalPages: 1 };

function mockUseNFTs(result: {
  data?: { data: NFT[]; meta: typeof mockMeta } | undefined;
  isLoading: boolean;
}) {
  (useNFTs as unknown as ReturnType<typeof vi.fn>).mockReturnValue(result);
}

function renderComponent() {
  return render(
    <I18nextProvider i18n={i18n}>
      <CollectionCarousel collection="Cosmic Bloom" />
    </I18nextProvider>
  );
}

describe("chunkIntoPages", () => {
  it("splits 12 items into pages of 5, 5 and 2", () => {
    const items = Array.from({ length: 12 }, (_, i) => i + 1) as unknown as NFT[];
    const pages = chunkIntoPages(items, 5);

    expect(pages).toHaveLength(3);
    expect(pages[0]).toHaveLength(5);
    expect(pages[1]).toHaveLength(5);
    expect(pages[2]).toHaveLength(2);
    expect(pages.flat()).toEqual(items);
  });
});

describe("CollectionCarousel", () => {
  it("fetches NFTs from the collection with a capped limit", () => {
    mockUseNFTs({ data: { data: makeNFTs(), meta: mockMeta }, isLoading: false });
    renderComponent();

    expect(useNFTs).toHaveBeenCalledWith({ collection: "Cosmic Bloom", limit: 15 });
  });

  it("renders the heading and every NFT card name across slides", () => {
    mockUseNFTs({ data: { data: makeNFTs(), meta: mockMeta }, isLoading: false });
    renderComponent();

    expect(
      screen.getByRole("heading", { level: 2, name: "Mais desta coleção" })
    ).toBeInTheDocument();
    // All slides stay in the DOM, so every name is visible to queries
    for (const name of NFT_NAMES) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders one dot indicator per page", () => {
    mockUseNFTs({ data: { data: makeNFTs(), meta: mockMeta }, isLoading: false });
    renderComponent();

    const dots = screen.getAllByRole("tab");
    expect(dots).toHaveLength(3);
  });

  it("renders 5 skeleton cards while loading", () => {
    mockUseNFTs({ data: undefined, isLoading: true });
    renderComponent();

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-label", "Carregando coleção...");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status.children).toHaveLength(5);
  });

  it("returns null when the collection has no NFTs and loading finished", () => {
    mockUseNFTs({
      data: { data: [], meta: { ...mockMeta, total: 0 } },
      isLoading: false,
    });
    const { container } = renderComponent();

    expect(container.firstChild).toBeNull();
  });
});
