# NFT Marketplace — Frontend Challenge

Aplicação web de um **marketplace de NFTs** construída em React + TypeScript, seguindo o [layout no Figma](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1) e o enunciado em [`CHALLENGE.md`](./CHALLENGE.md).

O produto usa a identidade visual **KURIO** e textos em pt-BR (`src/i18n/pt-BR.json`). APIs, autenticação, carteiras e pagamentos são simulados via **MSW**.

> ⚠️ **Status da entrega:** este repositório está em desenvolvimento. Os fluxos de **descoberta** (início + catálogo) e **detalhe do NFT** estão implementados; os fluxos de **conta**, **carrinho**, **pagamento** e **confirmação** estão apenas como _stubs_ (páginas com título, sem lógica). Consulte a seção [Status e pendências](#status-e-pendências) para a lista completa do que ainda falta em relação ao `CHALLENGE.md`.

---

## Sumário

- [Stack](#stack)
- [Status e pendências](#status-e-pendências)
- [Requisitos](#requisitos)
- [Setup](#setup)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Credenciais fictícias](#credenciais-fictícias)
- [Cenários de mock: seleção e reset](#cenários-de-mock-seleção-e-reset)
- [Comandos](#comandos)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Rotas](#rotas)
- [Contratos REST](#contratos-rest)
- [Eventos Socket.IO](#eventos-socketio)
- [Política de sessão](#política-de-sessão)
- [Estado do carrinho](#estado-do-carrinho)
- [Estratégia de cache](#estratégia-de-cache)
- [Reconciliação REST × Socket.IO](#reconciliação-rest--socketio)
- [Testes](#testes)
- [Auditoria Lighthouse](#auditoria-lighthouse)
- [Deploy](#deploy)
- [Acessibilidade](#acessibilidade)
- [Limitações e desvios do Figma](#limitações-e-desvios-do-figma)

---

## Stack

| Responsabilidade              | Tecnologia                     |
| ----------------------------- | ------------------------------ |
| Interface                     | React 19                       |
| Linguagem                     | TypeScript                     |
| Roteamento                    | TanStack Router                |
| Estado remoto                 | TanStack Query                 |
| Cliente HTTP                  | Axios                          |
| Integração de dados           | REST                           |
| Tempo real                    | Socket.IO (`socket.io-client`) |
| Estilização                   | Tailwind CSS v4                |
| Componentes                   | shadcn/ui (Radix UI)           |
| Mocking                       | MSW                            |
| Testes unitários              | Vitest + Testing Library       |
| Testes E2E e regressão visual | Playwright                     |
| Qualidade                     | Lighthouse, oxlint             |
| Build                         | Vite                           |

---

## Status e pendências

### Implementado

- **Início** (`/`): hero/carrossel de destaques, catálogo com **busca, filtros (categoria, rede, faixa de preço), abas (todos/novos/em alta), ordenação e paginação** sincronizados com a URL, seções de criadores e blog.
- **Detalhe do NFT** (`/nft/$id`): galeria com zoom, informações, edição/atributos, avaliações, carrossel da coleção, _skeleton_ de carregamento e estados de **erro** e **não encontrado (404)**.
- **Camada de dados**: cliente Axios com interceptors (token + refresh em 401), TanStack Query com política de cache/retry, contratos tipados em `src/types/nft.ts`.
- **MSW**: handlers para os recursos de NFT (listagem, destaque, filtros e detalhe), com suporte a latência, falha e respostas fora de ordem configuráveis.
- **Socket.IO**: cliente e hook (`useSocket`) com conexão, reconexão, _subscriptions_ e _listeners_ tipados. **Sem servidor/mock de socket ativo** (ver pendências).
- **i18n**: pt-BR.
- **Testes**: testes unitários (Vitest) de componentes e um esqueleto de testes E2E (Playwright).

---

## Requisitos

- **Node.js 20 LTS** ou superior (o projeto não fixa `engines` no `package.json`).
- **npm** (o lockfile versionado é `package-lock.json`).
- Navegador Chromium (para Playwright e Lighthouse).

---

## Setup

```bash
# 1. Clonar o repositório
git clone <URL_DO_REPOSITORIO>

# 2. Instalar dependências (checkout limpo)
npm ci

# 3. (Opcional) garantir o Service Worker do MSW em public/
# Ele já está versionado, mas este comando o regenera se necessário
npm run msw:init

# 4. Rodar em desenvolvimento (mocks ativos por padrão)
# Aplicação em http://localhost:5173
npm run dev
```

---

## Variáveis de ambiente

| Variável            | Padrão                              | Descrição                                                                             |
| ------------------- | ----------------------------------- | ------------------------------------------------------------------------------------- |
| `VITE_API_URL`      | `""` (mesma origem)                 | Base URL do cliente Axios. Vazio mantém requisições relativas para o MSW interceptar. |
| `VITE_SOCKET_URL`   | `http://localhost:3001`             | URL do servidor Socket.IO.                                                            |
| `VITE_ENABLE_MOCKS` | `true` (qualquer valor ≠ `"false"`) | Liga/desliga o MSW. Use `"false"` para apontar para uma API real.                     |

Exemplo de `.env` para desenvolvimento:

````dotenv
VITE_API_URL=
VITE_SOCKET_URL=http://localhost:3001
VITE_ENABLE_MOCKS=true

---

## Credenciais fictícias

> ⚠️ **Pendência:** o `CHALLENGE.md` exige **pelo menos dois usuários** fictícios e credenciais documentadas. **Nenhuma credencial está definida no código** — não há handlers de autenticação nem fixtures de usuário.

| E-mail        | Senha         | Perfil        |
| ------------- | ------------- | ------------- |
| _(a definir)_ | _(a definir)_ | _(a definir)_ |
| _(a definir)_ | _(a definir)_ | _(a definir)_ |

Quando o fluxo de conta for implementado, as credenciais devem usar dados fictícios e **nunca armazenar senhas em claro**.

---

## Cenários de mock: seleção e reset

Hoje o único controle de cenário disponível é **programático**, em `src/mocks/handlers/nfts.ts`:

```ts
import { setMockConfig, resetMockConfig } from "@/mocks/handlers/nfts";

// Simular latência de 1500 ms
setMockConfig({ delay: 1500 });

// Simular falha HTTP 500
setMockConfig({ shouldFail: true, failStatus: 500 });

// Simular resposta 404/403 etc.
setMockConfig({ shouldFail: true, failStatus: 404 });

// Simular respostas fora de ordem (uma requisição "antiga" por vez)
setMockConfig({ outOfOrder: true });

// Restaurar o cenário padrão (delay 0, sem falha, sem out-of-order)
resetMockConfig();
````

| Cenário                            | Como reproduzir                                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Carregamento lento / skeletons** | `setMockConfig({ delay: 2000 })` e recarregue a home/detalhe.                                                                |
| **Erro HTTP 5xx**                  | `setMockConfig({ shouldFail: true, failStatus: 500 })`. A home mostra o estado de erro; o detalhe mostra "Tentar novamente". |
| **Recurso inexistente (404)**      | Acesse `/nft/nao-existe` — o handler retorna 404 e a página exibe "NFT não encontrado".                                      |
| **Respostas fora de ordem**        | `setMockConfig({ outOfOrder: true })` e alterne filtros/páginas rapidamente.                                                 |
| **Reset**                          | `resetMockConfig()`.                                                                                                         |

---

## Comandos

| Comando                     | Descrição                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `npm run dev`               | Servidor de desenvolvimento (mocks ativos) em `http://localhost:5173`.             |
| `npm run build`             | Verificação de tipos + build de produção em `dist/`.                               |
| `npm run preview`           | Pré-visualiza o build em `http://localhost:4173`.                                  |
| `npm run typecheck`         | `tsc --noEmit`.                                                                    |
| `npm run lint`              | `oxlint`.                                                                          |
| `npm run test`              | Testes unitários (Vitest, modo watch).                                             |
| `npm run test:run`          | Testes unitários (execução única).                                                 |
| `npm run test:ui`           | Vitest UI.                                                                         |
| `npm run test:e2e`          | Playwright (sobe `npm run dev` automaticamente).                                   |
| `npm run test:e2e:ui`       | Playwright em modo UI.                                                             |
| `npm run msw:init`          | Regenera `public/mockServiceWorker.js`.                                            |
| `npm run lighthouse`        | Lighthouse (perfil desktop) em `http://localhost:4173` → `lighthouse-report.html`. |
| `npm run lighthouse:mobile` | Lighthouse (perfil mobile) → `lighthouse-report-mobile.html`.                      |

---

## Estrutura do projeto

```
src/
├── api/                 # Funções de acesso à API (Axios)
├── components/          # Componentes compartilhados (Header, Footer, NFTCard, ...)
│   └── ui/              # Componentes shadcn/ui
├── hooks/               # useNFTs, useSocket, use-toast
├── i18n/                # Traduções (pt-BR)
├── lib/                 # api (Axios), socket (Socket.IO), utils
├── mocks/               # MSW: browser, handlers, fixtures (data/nfts.ts)
├── pages/               # Páginas (Home, NFTDetail, Cart, Checkout, ...)
├── routes/              # Rotas TanStack Router (file-based) + routeTree.gen.ts
├── test/                # Setup do Vitest
└── types/               # Contratos de tipos (nft.ts)
e2e/                     # Testes Playwright
public/                  # Assets (imagens dos NFTs, mockServiceWorker.js)
```

---

## Rotas

| Rota         | Página                 | Estado          |
| ------------ | ---------------------- | --------------- |
| `/`          | Início (catálogo)      | ✅ Implementada |
| `/nft/$id`   | Detalhe do NFT         | ✅ Implementada |
| `/cart`      | Carrinho               | ⚠️ Stub         |
| `/checkout`  | Pagamento              | ⚠️ Stub         |
| `/order/$id` | Confirmação de pedido  | ⚠️ Stub         |
| `/login`     | Login                  | ⚠️ Stub         |
| `/register`  | Cadastro               | ⚠️ Stub         |
| `/profile`   | Perfil do colecionador | ⚠️ Stub         |
| `/wallets`   | Carteiras              | ⚠️ Stub         |

---

## Contratos REST

**Implementado (NFTs)** — consumido em `src/api/nft.ts`, mockado em `src/mocks/handlers/nfts.ts`. Os handlers registram tanto `/api/nfts*` quanto `/nfts*`.

| Método | Endpoint                                                                    | Descrição                                    | Resposta                                                                             |
| ------ | --------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------ |
| `GET`  | `/nfts?q&category&collection&minPrice&maxPrice&network&sort&tab&page&limit` | Lista com busca/filtros/ordenação/paginação. | `{ data: NFT[], meta: { total, page, limit, totalPages } }`                          |
| `GET`  | `/nfts/featured`                                                            | NFTs em destaque (8).                        | `{ data: NFT[] }`                                                                    |
| `GET`  | `/nfts/filters`                                                             | Opções de filtro.                            | `{ categories, networks, priceRange }`                                               |
| `GET`  | `/nfts/:id`                                                                 | Detalhe por id.                              | `NFT` (com `gallery`, `attributes`, `reviews`, `editions`, ...) ou `404 { message }` |

Erros: `5xx` (`{ message: "Internal Server Error" }`) e `404` (`{ message: "NFT not found" }`).

**Recursos exigidos e ainda não implementados** (nota): Sessão/conta (cadastro, login, sessão, logout, expiração), Favoritos, Carrinho, Cotação (cupom/disponibilidade/taxas/total), Pedidos (criação idempotente + estado/recibo), Perfil e Carteiras. Também não há representação dos erros exigidos (validação, sessão inválida, falta de permissão, recurso inexistente, conflito de disponibilidade, falha transitória) nem chave de idempotência nos pedidos.

---

---

## Limitações e desvios do Figma

> ⚠️ **Pendência:** o `CHALLENGE.md` pede que limitações, decisões de UX e desvios do Figma sejam registrados em **`ARCHITECTURE.md`**, que **ainda não existe** neste repositório.

Desvios/limitações conhecidos até aqui:

- **Imagens:** o catálogo usa placeholders SVG locais (`public/images/nfts/placeholder-1..8.svg`); as avatares de criadores/avaliações usam `api.dicebear.com` (dependência de rede externa).
- **Textos do catálogo:** nomes/descrições de NFTs em inglês no _fixture_ (`src/mocks/data/nfts.ts`), enquanto a UI está em pt-BR.
- **Preço:** trafega como `number`, não como string decimal (ver [Status e pendências](#status-e-pendências)).
- **Páginas em stub:** sem fidelidade ao Figma nos fluxos de conta/carrinho/checkout/confirmação.

---

## Referências

- Enunciado: [`CHALLENGE.md`](./CHALLENGE.md)
- Layout: [Figma — Frontend Challenge](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1)
