// Cart Types - ETH values travel as decimal strings to preserve precision (see CHALLENGE.md)
export interface CartItem {
  id: string; // cart item identifier
  nftId: string; // referenced NFT
  name: string;
  image: string;
  collection: string;
  tokenId?: string;
  edition?: number; // e.g. 4 for "1/50" style labels when combined with maxEdition
  maxEdition?: number;
  unitPrice: string; // ETH decimal string, e.g. "1.19"
  quantity: number; // integer, number of editions in the cart
  maxQuantity: number; // availability for this NFT/edition
  lineTotal: string; // unitPrice * quantity, ETH decimal string
}

export interface AppliedCoupon {
  code: string;
  percent: number; // e.g. 10 for 10% off
  discount: string; // ETH decimal string applied to the current subtotal
}

export interface CartSummary {
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
  coupon: AppliedCoupon | null;
}

export interface CartResponse {
  items: CartItem[];
  summary: CartSummary;
}

export interface AddCartItemPayload {
  nftId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

// Machine-readable error codes returned by the mock API (mapped to i18n in the UI)
export type CartErrorCode =
  "INVALID_COUPON" | "EXPIRED_COUPON" | "UNAVAILABLE_QUANTITY" | "NOT_FOUND";
