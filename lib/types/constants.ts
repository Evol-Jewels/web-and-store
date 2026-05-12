/**
 * Centralized constants for filtering, sizes, and product attributes
 */

export const METAL_COLORS = [
  "yellow gold",
  "rose gold",
  "white gold",
  "gold",
  "silver",
  "platinum",
  "14 kt",
  "18 kt",
  "22 kt",
  "24 kt",
];

export const RING_SIZES = ["5", "6", "7", "8", "9", "10"];
export const NECKLACE_LENGTHS = ['16"', '18"', '20"', '22"'];
export const BRACELET_SIZES = ["Small", "Medium", "Large"];

export const RING_PATTERNS = [
  /\/\s*(\d+)\s*$/,
  /\/\s*(\d+)\s*,/,
  /(?:ring\s+)?size[:\s-]*(\d+)/i,
  /\b(\d+)\s*(?:us\s+)?(?:ring|size)\b/i,
];

export const NECKLACE_PATTERNS = [
  /\/\s*(\d+)\s*["|"|"]?\s*$/,
  /\/\s*(\d+)\s*["|"|"]?\s*(?:inch|$)/i,
  /(?:chain\s+)?(?:length\s+)?(\d+)\s*(?:inch|"|"|inches)?/i,
  /(\d+)\s*(?:inch|"|"|inches)\s*(?:chain|necklace)?/i,
  /^(\d+)\s/,
];
