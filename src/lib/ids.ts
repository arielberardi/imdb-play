export function parsePositiveIntId(value: string | number): number | null {
  if (typeof value === "number") {
    if (!Number.isInteger(value) || value <= 0) {
      return null;
    }

    return value;
  }

  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}
