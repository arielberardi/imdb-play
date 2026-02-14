import { useCallback, useState } from "react";

interface UseRovingTabindexOptions {
  initialIndex?: number;
}

function clamp(index: number, itemCount: number): number {
  if (itemCount <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(index, itemCount - 1));
}

export function useRovingTabindex(itemCount: number, options: UseRovingTabindexOptions = {}) {
  const [activeIndex, setActiveIndexState] = useState(() =>
    clamp(options.initialIndex ?? 0, itemCount),
  );
  const normalizedActiveIndex = clamp(activeIndex, itemCount);

  const setActiveIndex = useCallback(
    (index: number) => {
      setActiveIndexState(clamp(index, itemCount));
    },
    [itemCount],
  );

  const getItemTabIndex = useCallback(
    (index: number): 0 | -1 => (index === normalizedActiveIndex ? 0 : -1),
    [normalizedActiveIndex],
  );

  const onItemFocus = useCallback(
    (index: number) => {
      setActiveIndexState(clamp(index, itemCount));
    },
    [itemCount],
  );

  return {
    activeIndex: normalizedActiveIndex,
    setActiveIndex,
    getItemTabIndex,
    onItemFocus,
  };
}
