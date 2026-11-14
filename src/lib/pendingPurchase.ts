// Pending purchase handoff between the details page and the login flow.
// When a logged-out user clicks "Comprar", the intended add-to-cart is
// stored here; after the simulated login completes, the item is added
// and the user is taken to the cart with it.

const PENDING_PURCHASE_KEY = "kurio:pending-purchase";

export interface PendingPurchase {
  nftId: string;
  quantity: number;
}

export function savePendingPurchase(purchase: PendingPurchase): void {
  try {
    localStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(purchase));
  } catch {
    // localStorage unavailable: the pending purchase simply won't survive
  }
}

function readPendingPurchase(): PendingPurchase | null {
  try {
    const raw = localStorage.getItem(PENDING_PURCHASE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingPurchase> | null;
    if (
      parsed &&
      typeof parsed.nftId === "string" &&
      typeof parsed.quantity === "number" &&
      Number.isInteger(parsed.quantity) &&
      parsed.quantity >= 1
    ) {
      return { nftId: parsed.nftId, quantity: parsed.quantity };
    }
  } catch {
    // corrupted entry falls through to removal
  }
  return null;
}

// Reads and clears the pending purchase in one step
export function consumePendingPurchase(): PendingPurchase | null {
  const purchase = readPendingPurchase();
  if (purchase) {
    try {
      localStorage.removeItem(PENDING_PURCHASE_KEY);
    } catch {
      // ignore storage failures
    }
  }
  return purchase;
}

export function clearPendingPurchase(): void {
  try {
    localStorage.removeItem(PENDING_PURCHASE_KEY);
  } catch {
    // ignore storage failures
  }
}
