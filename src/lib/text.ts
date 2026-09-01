export function toExcerpt(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const excerpt = normalized.slice(0, maxLength);
  const lastWordBoundary = excerpt.lastIndexOf(" ");

  return `${excerpt.slice(0, lastWordBoundary)}…`;
}
