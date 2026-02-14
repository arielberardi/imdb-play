"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

interface RegisteredRegion {
  id: string;
  order: number;
  itemCount: number;
  getLastFocusedIndex: () => number;
  focusAtIndex: (index: number) => void;
}

interface FocusRegionContextValue {
  registerRegion: (region: RegisteredRegion) => () => void;
  focusAdjacentRegion: (params: {
    currentRegionId: string;
    direction: "previous" | "next";
    preferredIndex: number;
  }) => boolean;
}

const FocusRegionContext = createContext<FocusRegionContextValue | null>(null);

function clamp(index: number, itemCount: number): number {
  if (itemCount <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(index, itemCount - 1));
}

function byOrder(a: RegisteredRegion, b: RegisteredRegion): number {
  if (a.order === b.order) {
    return a.id.localeCompare(b.id);
  }

  return a.order - b.order;
}

export function FocusRegionProvider({ children }: PropsWithChildren) {
  const regionsRef = useRef<Map<string, RegisteredRegion>>(new Map());

  const registerRegion = useCallback((region: RegisteredRegion) => {
    regionsRef.current.set(region.id, region);

    return () => {
      regionsRef.current.delete(region.id);
    };
  }, []);

  const focusAdjacentRegion = useCallback(
    ({
      currentRegionId,
      direction,
      preferredIndex,
    }: {
      currentRegionId: string;
      direction: "previous" | "next";
      preferredIndex: number;
    }): boolean => {
      const ordered = Array.from(regionsRef.current.values()).sort(byOrder);
      const currentIndex = ordered.findIndex((region) => region.id === currentRegionId);
      if (currentIndex < 0) {
        return false;
      }

      const targetIndex = direction === "previous" ? currentIndex - 1 : currentIndex + 1;
      const targetRegion = ordered[targetIndex];
      if (!targetRegion || targetRegion.itemCount <= 0) {
        return false;
      }

      const fallbackIndex = targetRegion.getLastFocusedIndex();
      const nextIndex = clamp(
        Number.isFinite(preferredIndex) ? preferredIndex : fallbackIndex,
        targetRegion.itemCount,
      );
      targetRegion.focusAtIndex(nextIndex);
      return true;
    },
    [],
  );

  const contextValue = useMemo<FocusRegionContextValue>(
    () => ({
      registerRegion,
      focusAdjacentRegion,
    }),
    [focusAdjacentRegion, registerRegion],
  );

  return <FocusRegionContext.Provider value={contextValue}>{children}</FocusRegionContext.Provider>;
}

interface UseFocusRegionOptions {
  order: number;
  itemCount: number;
  getLastFocusedIndex: () => number;
  focusAtIndex: (index: number) => void;
}

export function useFocusRegion(regionId: string, options: UseFocusRegionOptions) {
  const context = useContext(FocusRegionContext);

  useEffect(() => {
    if (!context) {
      return;
    }

    return context.registerRegion({
      id: regionId,
      order: options.order,
      itemCount: options.itemCount,
      getLastFocusedIndex: options.getLastFocusedIndex,
      focusAtIndex: options.focusAtIndex,
    });
  }, [
    context,
    options.focusAtIndex,
    options.getLastFocusedIndex,
    options.itemCount,
    options.order,
    regionId,
  ]);

  const focusPreviousRegion = useCallback(
    (preferredIndex: number) => {
      if (!context) {
        return false;
      }

      return context.focusAdjacentRegion({
        currentRegionId: regionId,
        direction: "previous",
        preferredIndex,
      });
    },
    [context, regionId],
  );

  const focusNextRegion = useCallback(
    (preferredIndex: number) => {
      if (!context) {
        return false;
      }

      return context.focusAdjacentRegion({
        currentRegionId: regionId,
        direction: "next",
        preferredIndex,
      });
    },
    [context, regionId],
  );

  return {
    focusPreviousRegion,
    focusNextRegion,
  };
}
