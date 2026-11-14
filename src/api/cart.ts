// Cart API functions (Axios)
import { api } from "@/lib/api";
import type {
  AddCartItemPayload,
  CartResponse,
  UpdateCartItemPayload,
} from "@/types/cart";

const CART_ENDPOINT = "/api/cart";

export async function fetchCart(): Promise<CartResponse> {
  const response = await api.get<CartResponse>(CART_ENDPOINT);
  return response.data;
}

export async function addCartItem(
  payload: AddCartItemPayload,
): Promise<CartResponse> {
  const response = await api.post<CartResponse>(
    `${CART_ENDPOINT}/items`,
    payload,
  );
  return response.data;
}

export async function updateCartItem(
  itemId: string,
  payload: UpdateCartItemPayload,
): Promise<CartResponse> {
  const response = await api.patch<CartResponse>(
    `${CART_ENDPOINT}/items/${itemId}`,
    payload,
  );
  return response.data;
}

export async function removeCartItem(itemId: string): Promise<CartResponse> {
  const response = await api.delete<CartResponse>(
    `${CART_ENDPOINT}/items/${itemId}`,
  );
  return response.data;
}

// Erases the entire cart (called when the user logs out)
export async function clearCart(): Promise<CartResponse> {
  const response = await api.delete<CartResponse>(CART_ENDPOINT);
  return response.data;
}

export async function applyCoupon(code: string): Promise<CartResponse> {
  const response = await api.post<CartResponse>(`${CART_ENDPOINT}/coupon`, {
    code,
  });
  return response.data;
}

export async function removeCoupon(): Promise<CartResponse> {
  const response = await api.delete<CartResponse>(`${CART_ENDPOINT}/coupon`);
  return response.data;
}
