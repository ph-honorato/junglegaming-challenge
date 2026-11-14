// Formatting helpers - ETH values are decimal strings end-to-end (see CHALLENGE.md)

// Normalizes a numeric value into a trimmed ETH decimal string (e.g. 26.83, 0.016)
export function toEthString(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return String(Number(value.toFixed(4)));
}

// Appends the ETH suffix for display, preserving precision (e.g. "26.846 ETH")
export function formatEth(value: string | number): string {
  const num = typeof value === "string" ? Number(value) : value;
  return `${toEthString(num)} ETH`;
}
