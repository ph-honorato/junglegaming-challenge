// BlogSection Types
export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  category: string;
  slug: string;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "Como Identificar NFTs Valiosos Antes de Todos",
    excerpt:
      "Aprenda os sinais que indicam quando um projeto NFT tem potencial de valorização a longo prazo.",
    date: "2024-12-15",
    readTime: 8,
    category: "Guia",
    slug: "identificar-nfts-valiosos",
    image: "/images/nfts/placeholder-1.svg",
  },
  {
    title: "O Futuro dos Royalties: O Que Mudou em 2024",
    excerpt:
      "Análise completa das novas políticas de royalties nas principais marketplaces e seu impacto nos criadores.",
    date: "2024-12-10",
    readTime: 12,
    category: "Análise",
    slug: "futuro-royalties-2024",
    image: "/images/nfts/placeholder-2.svg",
  },
  {
    title: "Segurança no Web3: Protegendo Seus Ativos Digitais",
    excerpt:
      "As melhores práticas para manter sua carteira e NFTs seguros contra golpes e ataques.",
    date: "2024-12-05",
    readTime: 10,
    category: "Segurança",
    slug: "seguranca-web3",
    image: "/images/nfts/placeholder-3.svg",
  },
  {
    title: "Tendências de Arte Generativa para 2025",
    excerpt:
      "Explorando como IA e algoritmos estão moldando a nova onda de arte digital colecionável.",
    date: "2024-11-28",
    readTime: 7,
    category: "Tendências",
    slug: "tendencias-arte-generativa-2025",
    image: "/images/nfts/placeholder-4.svg",
  },
];
