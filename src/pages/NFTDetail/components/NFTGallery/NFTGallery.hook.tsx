// NFTGallery state hook
import { useState } from "react";

// Keeps an index inside the current images range; empty lists resolve to 0
function clampIndex(index: number, length: number): number {
  if (length === 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

export function useNFTGallery(images: string[]) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // The stored selection is clamped during render, so a shrinking list stays safe
  const safeIndex = clampIndex(selectedIndex, images.length);
  const selectedImage = images.length > 0 ? images[safeIndex] : undefined;

  function selectImage(index: number) {
    setSelectedIndex(clampIndex(index, images.length));
  }

  function openZoom() {
    setIsZoomOpen(true);
  }

  function closeZoom() {
    setIsZoomOpen(false);
  }

  return {
    selectedIndex: safeIndex,
    selectedImage,
    selectImage,
    isZoomOpen,
    openZoom,
    closeZoom,
  };
}
