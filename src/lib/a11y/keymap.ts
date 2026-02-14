export function isArrowLeft(key: string): boolean {
  return key === "ArrowLeft";
}

export function isArrowRight(key: string): boolean {
  return key === "ArrowRight";
}

export function isArrowUp(key: string): boolean {
  return key === "ArrowUp";
}

export function isArrowDown(key: string): boolean {
  return key === "ArrowDown";
}

export function isActivationKey(key: string): boolean {
  return key === "Enter" || key === " ";
}
