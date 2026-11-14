# Arquitetura — NFT Marketplace

Documento de arquitetura do projeto. Reúne a estrutura do código, as rotas da aplicação, os contratos REST e as limitações/decisões de UX em relação ao Figma.

## Sumário

- [Estrutura do projeto](#estrutura-do-projeto)
- [Rotas](#rotas)
- [Contratos REST](#contratos-rest)
- [Limitações e desvios do Figma](#limitações-e-desvios-do-figma)

---

## Estrutura do projeto

```
src/
├── api/                 # Funções de acesso à API (Axios)
├── components/          # Componentes compartilhados (Header, Footer, NFTCard, ...)
│   └── ui/              # Componentes shadcn/ui
├── hooks/               # useNFTs, useCart, use-toast
├── i18n/                # Traduções (pt-BR)
├── lib/                 # api (Axios), utils
├── mocks/               # MSW: browser, handlers, fixtures (data/nfts.ts)
├── pages/               # Páginas (Home, NFTDetail, Cart, Login, ...)
├── routes/              # Rotas TanStack Router (file-based) + routeTree.gen.ts
├── test/                # Setup do Vitest
└── types/               # Contratos de tipos (nft.ts)
e2e/                     # Testes Playwright
public/                  # Assets (imagens dos NFTs, mockServiceWorker.js)
```

---

## Rotas

| Rota       | Página                  |
| ---------- | ----------------------- |
| `/`        | Início (catálogo)       |
| `/nft/$id` | Detalhe do NFT          |
| `/cart`    | Carrinho                |
| `/login`   | Login (sessão simulada) |

---

## Contratos REST

**NFTs** — consumido em `src/api/nft.ts`, mockado em `src/mocks/handlers/nfts.ts`. Os handlers registram tanto `/api/nfts*` quanto `/nfts*`.

| Método | Endpoint                                                                    | Descrição                                    | Resposta                                                                             |
| ------ | --------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------ |
| `GET`  | `/nfts?q&category&collection&minPrice&maxPrice&network&sort&tab&page&limit` | Lista com busca/filtros/ordenação/paginação. | `{ data: NFT[], meta: { total, page, limit, totalPages } }`                          |
| `GET`  | `/nfts/featured`                                                            | NFTs em destaque (8).                        | `{ data: NFT[] }`                                                                    |
| `GET`  | `/nfts/filters`                                                             | Opções de filtro.                            | `{ categories, networks, priceRange }`                                               |
| `GET`  | `/nfts/:id`                                                                 | Detalhe por id.                              | `NFT` (com `gallery`, `attributes`, `reviews`, `editions`, ...) ou `404 { message }` |

Erros: `5xx` (`{ message: "Internal Server Error" }`) e `404` (`{ message: "NFT not found" }`).

**Carrinho** — consumido em `src/api/cart.ts`, mockado em `src/mocks/handlers/cart.ts` (estado do carrinho persistido em `localStorage`).

| Método   | Endpoint                  | Descrição                             | Resposta               |
| -------- | ------------------------- | ------------------------------------- | ---------------------- |
| `GET`    | `/api/cart`               | Carrinho atual (itens + resumo).      | `CartResponse`         |
| `POST`   | `/api/cart/items`         | Adiciona item (`nftId`, `quantity`).  | `201` + `CartResponse` |
| `PATCH`  | `/api/cart/items/:itemId` | Atualiza a quantidade de um item.     | `CartResponse`         |
| `DELETE` | `/api/cart/items/:itemId` | Remove um item.                       | `CartResponse`         |
| `DELETE` | `/api/cart`               | Esvazia o carrinho (usado no logout). | `CartResponse`         |
| `POST`   | `/api/cart/coupon`        | Aplica cupom (`KURIO10`, `LAUNCH5`).  | `CartResponse`         |
| `DELETE` | `/api/cart/coupon`        | Remove o cupom aplicado.              | `CartResponse`         |

Erros: `400` (`UNAVAILABLE_QUANTITY`, `INVALID_COUPON`), `404` (`NOT_FOUND`), `409` (`UNAVAILABLE_QUANTITY`) e `5xx` (`INTERNAL_ERROR`).

---

## Desvios do Figma

- **Imagens:** o catálogo usa placeholders SVG locais (`public/images/nfts/placeholder-1..8.svg`); as avatares de criadores/avaliações usam `api.dicebear.com` (dependência de rede externa).
- **Textos do catálogo:** nomes/descrições de NFTs em inglês no _fixture_ (`src/mocks/data/nfts.ts`), enquanto a UI está em pt-BR.
- **Tipografia:** mantida a padrão do Vite por questões de gestão de tempo e para não fugir muito do proposto.
- **Cor da logo:** deixada em laranja para dar destaque.
- **Espaçamento e cores:** alguns espaçamentos e cores foram alterados para dar/remover destaques.
