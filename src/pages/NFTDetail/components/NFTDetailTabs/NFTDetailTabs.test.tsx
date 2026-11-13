// NFTDetailTabs Unit Tests
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { NFTDetailTabs } from "./NFTDetailTabs";
import type { NFT } from "@/types/nft";

// Radix Tabs triggers activate on mousedown, not click.
function openReviewsTab() {
  fireEvent.mouseDown(screen.getByRole("tab", { name: /Avaliações de colecionadores/ }));
}

// Mock reviews: the third one has no avatar to cover the optional avatar case.
const mockReviews = [
  {
    id: "review-1",
    user: "Ana Souza",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
    rating: 5,
    date: "2026-01-10T00:00:00Z",
    comment: "Arte impressionante, a textura é incrível de perto.",
  },
  {
    id: "review-2",
    user: "Bruno Lima",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bruno",
    rating: 4,
    date: "2026-01-12T00:00:00Z",
    comment: "Excelente peça de coleção, chegou muito bem embalada.",
  },
  {
    id: "review-3",
    user: "Carla Dias",
    rating: 3,
    date: "2026-01-15T00:00:00Z",
    comment: "Gostei, mas esperava mais detalhes no verso.",
  },
];

const mockNFT: NFT = {
  id: "nft-1",
  name: "Cosmic Bloom #118",
  price: 2.5,
  network: "Ethereum",
  image: "/images/nfts/placeholder-1.svg",
  collection: "Cosmic Bloom",
  release_date: "2026-01-01T00:00:00Z",
  isTrending: false,
  description: "Descrição curta do NFT.",
  longDescription: [
    "Primeiro parágrafo da descrição longa do NFT.",
    "Segundo parágrafo da descrição longa do NFT.",
  ],
  contract: "0x7A42fa19B2E5C7d83F9a01BbC64Df8E1A2b919E8",
  tokenStandard: "ERC-721",
  royalties: 5,
  reviews: mockReviews,
};

function renderComponent(nft: NFT = mockNFT) {
  return render(
    <I18nextProvider i18n={i18n}>
      <NFTDetailTabs nft={nft} />
    </I18nextProvider>
  );
}

describe("NFTDetailTabs", () => {
  it("renders both tab labels with the reviews count", () => {
    renderComponent();

    expect(screen.getByRole("tab", { name: "Detalhes do NFT" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Avaliações de colecionadores (3)" })
    ).toBeInTheDocument();
  });

  it("shows the details content by default", () => {
    renderComponent();

    expect(screen.getByText("Primeiro parágrafo da descrição longa do NFT.")).toBeVisible();
    expect(screen.getByText("Segundo parágrafo da descrição longa do NFT.")).toBeVisible();
    expect(screen.getByText(/0x7A42\.\.\.19E8/)).toBeVisible();
    expect(screen.getByText(/Contrato inteligente ERC-721 verificado\./)).toBeVisible();
    // longDescription takes precedence over the short description
    expect(screen.queryByText("Descrição curta do NFT.")).not.toBeInTheDocument();
  });

  it("shows the reviewers' names when the reviews tab is clicked", () => {
    renderComponent();

    openReviewsTab();

    expect(screen.getByText("Ana Souza")).toBeVisible();
    expect(screen.getByText("Bruno Lima")).toBeVisible();
    expect(screen.getByText("Carla Dias")).toBeVisible();
  });

  it("renders the star rating labels and lazy review avatars", () => {
    renderComponent();

    openReviewsTab();

    expect(screen.getByRole("img", { name: "Nota 5 de 5" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Nota 3 de 5" })).toBeInTheDocument();
    expect(screen.getByAltText("Avatar de Ana Souza")).toHaveAttribute("loading", "lazy");
    // Carla Dias has no avatar
    expect(screen.queryByAltText("Avatar de Carla Dias")).not.toBeInTheDocument();
  });

  it("fills exactly one star per rating point", () => {
    renderComponent();

    openReviewsTab();

    const threeStars = screen.getByRole("img", { name: "Nota 3 de 5" });
    expect(threeStars.querySelectorAll('svg[class*="fill-primary"]')).toHaveLength(3);
    expect(threeStars.querySelectorAll('svg[class*="text-muted-foreground/40"]')).toHaveLength(2);
  });

  it("renders review dates as <time> elements", () => {
    const { container } = renderComponent();

    openReviewsTab();

    const times = container.querySelectorAll("time");
    expect(times).toHaveLength(3);
    times.forEach((time) => expect(time).toHaveAttribute("datetime"));
  });

  it("shows the empty message for an NFT without reviews", () => {
    renderComponent({ ...mockNFT, reviews: undefined });

    expect(
      screen.getByRole("tab", { name: "Avaliações de colecionadores (0)" })
    ).toBeInTheDocument();

    openReviewsTab();

    expect(screen.getByText("Este NFT ainda não possui avaliações.")).toBeVisible();
  });
});
