// Cart Hooks using TanStack Query
// All mutations return the full CartResponse, which becomes the new cached cart.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCartItem,
  applyCoupon,
  fetchCart,
  removeCartItem,
  removeCoupon,
  updateCartItem,
} from "@/api/cart";
import type { AddCartItemPayload, CartResponse } from "@/types/cart";
import { toEthString } from "@/lib/format";

const CART_QUERY_KEY = "cart" as const;

export const cartQueryKeys = {
  all: [CART_QUERY_KEY] as const,
};

// Recomputes the cart summary locally for optimistic updates (rolled back on failure)
function recomputeCart(
  cart: CartResponse,
  updater: (items: CartResponse["items"]) => CartResponse["items"],
): CartResponse {
  const items = updater(cart.items);
  const subtotal = items.reduce((acc, item) => acc + Number(item.lineTotal), 0);
  const coupon = cart.summary.coupon;
  const discount = coupon ? (subtotal * coupon.percent) / 100 : 0;
  const networkFee = Number(cart.summary.networkFee);
  const total = subtotal - discount + networkFee;

  return {
    items,
    summary: {
      subtotal: toEthString(subtotal),
      discount: toEthString(discount),
      networkFee: cart.summary.networkFee,
      total: toEthString(total),
      coupon: coupon ? { ...coupon, discount: toEthString(discount) } : null,
    },
  };
}

export function useCart() {
  return useQuery<CartResponse, Error>({
    queryKey: cartQueryKeys.all,
    queryFn: fetchCart,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}

export function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation<CartResponse, Error, AddCartItemPayload>({
    mutationFn: addCartItem,
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKeys.all, data);
    },
  });
}

// Optimistic quantity change: cache is updated immediately and rolled back on error
export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  return useMutation<
    CartResponse,
    Error,
    { itemId: string; quantity: number },
    { previous: CartResponse | undefined }
  >({
    mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, { quantity }),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartQueryKeys.all });
      const previous = queryClient.getQueryData<CartResponse>(
        cartQueryKeys.all,
      );
      if (previous) {
        queryClient.setQueryData<CartResponse>(
          cartQueryKeys.all,
          recomputeCart(previous, (items) =>
            items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    quantity,
                    lineTotal: toEthString(Number(item.unitPrice) * quantity),
                  }
                : item,
            ),
          ),
        );
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(cartQueryKeys.all, context.previous);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKeys.all, data);
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation<CartResponse, Error, string>({
    mutationFn: removeCartItem,
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKeys.all, data);
    },
  });
}

export function useApplyCoupon() {
  const queryClient = useQueryClient();
  return useMutation<CartResponse, Error, string>({
    mutationFn: applyCoupon,
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKeys.all, data);
    },
  });
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient();
  return useMutation<CartResponse, Error, void>({
    mutationFn: removeCoupon,
    onSuccess: (data) => {
      queryClient.setQueryData(cartQueryKeys.all, data);
    },
  });
}
