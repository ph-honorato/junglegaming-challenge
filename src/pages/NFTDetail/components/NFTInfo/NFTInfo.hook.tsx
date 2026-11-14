import { useState } from "react";

import type { NFT } from "@/types/nft";

export function useNFTInfo(nft: NFT) {
  const [quantity, setQuantity] = useState(1);
  // Edition selection defaults to the last badge, which the design highlights.
  const [selectedEditionIndex, setSelectedEditionIndex] = useState(() =>
    nft.editions && nft.editions.length > 0 ? nft.editions.length - 1 : -1,
  );

  const maxQuantity = Math.max(1, nft.maxEdition ?? 1);

  const increaseQuantity = () =>
    setQuantity((current) => Math.min(current + 1, maxQuantity));

  const decreaseQuantity = () =>
    setQuantity((current) => Math.max(current - 1, 1));

  const canIncrease = quantity < maxQuantity;
  const canDecrease = quantity > 1;

  const selectEdition = (index: number) => setSelectedEditionIndex(index);

  return {
    quantity,
    increaseQuantity,
    decreaseQuantity,
    canIncrease,
    canDecrease,
    selectedEditionIndex,
    selectEdition,
  };
}
