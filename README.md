# NFT Marketplace — Frontend Challenge

Aplicação web de um **marketplace de NFTs** construída em React + TypeScript, seguindo o [layout no Figma](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1) e o enunciado em [`CHALLENGE.md`](./CHALLENGE.md).

O produto usa a identidade visual **KURIO** e textos em pt-BR (`src/i18n/pt-BR.json`). As APIs de NFTs e carrinho são simuladas via **MSW**, e a sessão é simulada no cliente.

> **Status da entrega:** os fluxos de **início/catálogo**, **detalhe do NFT**, **carrinho** e **login simulado** estão implementados; **checkout/pagamento**, **confirmação de pedido**, **cadastro**, **perfil** e **carteiras** não foram implementados. Detalhes na seção [Status da implementação](#status-da-implementação).

---

## Sumário

- [Stack](#stack)
- [Status da implementação](#status-da-implementação)
- [Requisitos](#requisitos)
- [Setup](#setup)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Cenários de mock: seleção e reset](#cenários-de-mock-seleção-e-reset)
- [Comandos](#comandos)
- [Arquitetura](./ARCHITECTURE.md)

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
| Estilização                   | Tailwind CSS v4                |
| Componentes                   | shadcn/ui (Radix UI)           |
| Mocking                       | MSW                            |
| Testes unitários              | Vitest + Testing Library       |
| Testes E2E                    | Playwright                     |
| Qualidade                     | Lighthouse, oxlint             |
| Build                         | Vite                           |

---

## Status da implementação

### Implementado

- **Início** (`/`): hero/carrossel de destaques e catálogo com **busca, filtros (categoria, rede, faixa de preço), abas, ordenação e paginação** sincronizados com a URL, além das seções de criadores e blog.
- **Detalhe do NFT** (`/nft/$id`): galeria, edição/atributos, avaliações, carrossel da coleção e estados de **carregamento**, **erro** e **não encontrado (404)**.
- **Carrinho** (`/cart`): adicionar/atualizar/remover itens, **cupons** (`KURIO10`, `LAUNCH5`), resumo com taxas, persistência após refresh e limpeza no logout.
- **Login** (`/login`): sessão **simulada no cliente** (login/logout), com retomada de compra iniciada antes do login.
- **Camada de dados**: cliente Axios com interceptors (token + refresh em 401), TanStack Query com cache/retry e contratos tipados.
- **MSW**: handlers de NFTs e carrinho, com latência, falhas e respostas fora de ordem configuráveis.
- **i18n**: pt-BR.
- **Testes**: unitários (Vitest) e E2E dos fluxos críticos (Playwright).

### Não implementado

- **Checkout** (`/checkout`), **confirmação de pedido** (`/order/$id`), **cadastro** (`/register`), **perfil** (`/profile`) e **carteiras** (`/wallets`): apenas páginas _stub_, sem lógica.
- **Autenticação real**: o login é simulado no cliente; não há API de autenticação, usuários nem credenciais fictícias.
- **Pedidos e favoritos**: nenhum endpoint ou fluxo.
- **Tempo real**: existe um cliente Socket.IO no código, mas ele não é usado por nenhuma tela e não há servidor/mock ativo.

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
| `VITE_ENABLE_MOCKS` | `true` (qualquer valor ≠ `"false"`) | Liga/desliga o MSW. Use `"false"` para apontar para uma API real.                     |

Exemplo de `.env` para desenvolvimento:

````dotenv
VITE_API_URL=
VITE_ENABLE_MOCKS=true
````

---

## Cenários de mock: seleção e reset

O controle de cenário é **programático**, em `src/mocks/handlers/nfts.ts` (NFTs) e `src/mocks/handlers/cart.ts` (carrinho):

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

// Carrinho: simular falha HTTP 500 (import de "@/mocks/handlers/cart")
setCartMockConfig({ shouldFail: true, failStatus: 500 });
resetCartMockConfig();
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

## Referências

- Enunciado: [`CHALLENGE.md`](./CHALLENGE.md)
- Layout: [Figma — Frontend Challenge](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1)
