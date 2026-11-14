// MSW Handlers for Cart
// Keeps in-memory cart state, hydrated from localStorage so a refresh preserves the cart.
import { http, HttpResponse, delay } from "msw";
import { ALL_NFTS, getNFTById } from "@/mocks/data/nfts";
import type { CartItem, CartResponse } from "@/types/cart";
import { toEthString } from "@/lib/format";

// Flat network fee for the simulation ("Taxa estimada" in the layout)
const NETWORK_FEE = "0.016";

// Availability per NFT/edition in the demo scenario
const DEFAULT_AVAILABILITY = 10;

// Deterministic coupon fixtures
const COUPONS: Record<string, number> = {
  KURIO10: 10,
  LAUNCH5: 5,
};

interface StoredCartItem {
  id: string;
  nftId: string;
  quantity: number;
  maxQuantity: number;
}

interface StoredCartState {
  items: StoredCartItem[];
  coupon: { code: string; percent: number } | null;
}

const STORAGE_KEY = "kurio:cart-state";

// Configurable delay/failure for testing loading and error states
let requestDelay = 120;
let shouldFail = false;
let failStatus = 500;

export function setCartMockConfig(config: {
  delay?: number;
  shouldFail?: boolean;
  failStatus?: number;
}) {
  if (config.delay !== undefined) requestDelay = config.delay;
  if (config.shouldFail !== undefined) shouldFail = config.shouldFail;
  if (config.failStatus !== undefined) failStatus = config.failStatus;
}

export function resetCartMockConfig() {
  requestDelay = 120;
  shouldFail = false;
  failStatus = 500;
}

function defaultState(): StoredCartState {
  // Seed mirrors the Figma cart: three items with quantities 2, 6 and 9
  const seedIds = ["nft-1", "nft-2", "nft-3"];
  const seedQuantities = [2, 6, 9];
  return {
    items: seedIds.map((nftId, index) => ({
      id: `cart-item-${index + 1}`,
      nftId,
      quantity: seedQuantities[index],
      maxQuantity: DEFAULT_AVAILABILITY,
    })),
    coupon: null,
  };
}

function loadState(): StoredCartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredCartState;
      if (Array.isArray(parsed.items)) {
        return parsed;
      }
    }
  } catch {
    // corrupted storage falls back to the known scenario
  }
  return defaultState();
}

function saveState(state: StoredCartState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable: keep in-memory state only
  }
}

export function resetCartState() {
  const state = defaultState();
  saveState(state);
  return state;
}

let state: StoredCartState = loadState();

function buildCartItem(stored: StoredCartItem): CartItem | null {
  const nft = getNFTById(stored.nftId);
  if (!nft) {
    // NFT removed from the catalog: drop it from the cart response
    return null;
  }
  const unitPrice = nft.price;
  const lineTotal = unitPrice * stored.quantity;
  return {
    id: stored.id,
    nftId: nft.id,
    name: nft.name,
    image: nft.image,
    collection: nft.collection,
    tokenId: `#${stored.nftId.replace("nft-", "").padStart(4, "0")}`,
    edition: nft.edition,
    maxEdition: nft.maxEdition,
    unitPrice: toEthString(unitPrice),
    quantity: stored.quantity,
    maxQuantity: stored.maxQuantity,
    lineTotal: toEthString(lineTotal),
  };
}

function buildCartResponse(currentState: StoredCartState): CartResponse {
  const items = currentState.items
    .map(buildCartItem)
    .filter((item): item is CartItem => item !== null);

  const subtotal = items.reduce((acc, item) => acc + Number(item.lineTotal), 0);
  const discount = currentState.coupon
    ? (subtotal * currentState.coupon.percent) / 100
    : 0;
  const networkFee = Number(NETWORK_FEE);
  const total = subtotal - discount + networkFee;

  return {
    items,
    summary: {
      subtotal: toEthString(subtotal),
      discount: toEthString(discount),
      networkFee: toEthString(networkFee),
      total: toEthString(total),
      coupon: currentState.coupon
        ? {
            code: currentState.coupon.code,
            percent: currentState.coupon.percent,
            discount: toEthString(discount),
          }
        : null,
    },
  };
}

async function maybeDelay() {
  if (requestDelay > 0) {
    await delay(requestDelay);
  }
}

function errorResponse(status: number, code: string) {
  return HttpResponse.json({ message: code }, { status });
}

const handleGetCart = async () => {
  await maybeDelay();
  if (shouldFail) return errorResponse(failStatus, "INTERNAL_ERROR");
  // Drop stored items whose NFT left the catalog, then persist the cleanup
  state.items = state.items.filter((item) => getNFTById(item.nftId) !== null);
  saveState(state);
  return HttpResponse.json(buildCartResponse(state));
};

const handleAddCartItem = async ({ request }: { request: Request }) => {
  await maybeDelay();
  if (shouldFail) return errorResponse(failStatus, "INTERNAL_ERROR");

  const body = (await request.json()) as { nftId?: string; quantity?: number };
  const nftId = body.nftId ?? "";
  const quantity = Math.max(1, Math.floor(body.quantity ?? 1));

  const nft = getNFTById(nftId);
  if (!nft) return errorResponse(404, "NOT_FOUND");

  const existing = state.items.find((item) => item.nftId === nftId);
  if (existing) {
    const nextQuantity = Math.min(
      existing.quantity + quantity,
      existing.maxQuantity,
    );
    existing.quantity = nextQuantity;
  } else {
    state.items.push({
      id: `cart-item-${Date.now()}`,
      nftId,
      quantity,
      maxQuantity: DEFAULT_AVAILABILITY,
    });
  }
  saveState(state);
  return HttpResponse.json(buildCartResponse(state), { status: 201 });
};

const handleUpdateCartItem = async ({
  request,
  params,
}: {
  request: Request;
  params: Record<string, string | readonly string[] | undefined>;
}) => {
  await maybeDelay();
  if (shouldFail) return errorResponse(failStatus, "INTERNAL_ERROR");

  const itemId = Array.isArray(params.itemId)
    ? params.itemId[0]
    : params.itemId;
  const item = state.items.find((stored) => stored.id === itemId);
  if (!item) return errorResponse(404, "NOT_FOUND");

  const body = (await request.json()) as { quantity?: number };
  const quantity = Math.floor(body.quantity ?? item.quantity);

  if (quantity < 1) return errorResponse(400, "UNAVAILABLE_QUANTITY");
  if (quantity > item.maxQuantity)
    return errorResponse(409, "UNAVAILABLE_QUANTITY");

  item.quantity = quantity;
  saveState(state);
  return HttpResponse.json(buildCartResponse(state));
};

const handleRemoveCartItem = async ({
  params,
}: {
  params: Record<string, string | readonly string[] | undefined>;
}) => {
  await maybeDelay();
  if (shouldFail) return errorResponse(failStatus, "INTERNAL_ERROR");

  const itemId = Array.isArray(params.itemId)
    ? params.itemId[0]
    : params.itemId;
  const before = state.items.length;
  state.items = state.items.filter((stored) => stored.id !== itemId);
  if (state.items.length === before) return errorResponse(404, "NOT_FOUND");

  saveState(state);
  return HttpResponse.json(buildCartResponse(state));
};

const handleApplyCoupon = async ({ request }: { request: Request }) => {
  await maybeDelay();
  if (shouldFail) return errorResponse(failStatus, "INTERNAL_ERROR");

  const body = (await request.json()) as { code?: string };
  const code = (body.code ?? "").trim().toUpperCase();
  const percent = COUPONS[code];

  if (!percent) return errorResponse(400, "INVALID_COUPON");

  state.coupon = { code, percent };
  saveState(state);
  return HttpResponse.json(buildCartResponse(state));
};

const handleRemoveCoupon = async () => {
  await maybeDelay();
  if (shouldFail) return errorResponse(failStatus, "INTERNAL_ERROR");

  state.coupon = null;
  saveState(state);
  return HttpResponse.json(buildCartResponse(state));
};

export const cartHandlers = [
  // Only /api/cart: a bare "/cart" handler would hijack document navigations
  // to the /cart SPA route and return JSON instead of the app.
  http.get("/api/cart", handleGetCart),

  http.post("/api/cart/items", handleAddCartItem),

  http.patch("/api/cart/items/:itemId", handleUpdateCartItem),

  http.delete("/api/cart/items/:itemId", handleRemoveCartItem),

  http.post("/api/cart/coupon", handleApplyCoupon),

  http.delete("/api/cart/coupon", handleRemoveCoupon),
];

// Re-exported for fixtures/tests that need the catalog reference
export { ALL_NFTS };
