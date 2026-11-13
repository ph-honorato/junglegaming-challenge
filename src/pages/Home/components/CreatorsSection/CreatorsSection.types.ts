// CreatorBanners Types
export interface CreatorBannerProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

export const CREATOR_BANNERS: CreatorBannerProps[] = [
  {
    title: "Lançamentos Gênesis de edição limitada",
    description:
      "Colecione edições escassas diretamente dos criadores antes da revelação pública",
    image: "https://picsum.photos/seed/creator1/800/400.jpg",
    href: "/creators",
  },
  {
    title: "Arte digital selecionada e muito mais",
    description:
      "Explore novos artistas, coleções verificadas e obras digitais que definem tendências",
    image: "https://picsum.photos/seed/creator2/800/400.jpg",
    href: "/creators/create",
  },
];
