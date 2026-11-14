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

## Referências

- Enunciado: [`CHALLENGE.md`](./CHALLENGE.md)
- Layout: [Figma — Frontend Challenge](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1)
