import { useState, useCallback } from 'react';
import { formatPathForCopy } from '../utils/pathUtils';

interface MenuState {
  x: number;
  y: number;
  extraKey?: string;
  value?: unknown;
}

interface UseContextMenuReturn {
  menuState: MenuState | null;
  openMenu: (e: React.MouseEvent, extraKey?: string, value?: unknown) => void;
  closeMenu: () => void;
  copyPath: () => void;
  copyJson: () => void;
}

export function useContextMenu(basePath: (string | number)[], nodeValue?: unknown): UseContextMenuReturn {
  const [menuState, setMenuState] = useState<MenuState | null>(null);

  const openMenu = useCallback((e: React.MouseEvent, extraKey?: string, value?: unknown) => {
    e.preventDefault();
    setMenuState({ x: e.clientX, y: e.clientY, extraKey, value });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuState(null);
  }, []);

  const copyPath = useCallback(() => {
    const fullPath = menuState?.extraKey
      ? [...basePath, menuState.extraKey]
      : basePath;
    navigator.clipboard.writeText(formatPathForCopy(fullPath));
    setMenuState(null);
  }, [basePath, menuState]);

  const copyJson = useCallback(() => {
    // Use the value from menuState if it exists (for property keys), otherwise use nodeValue
    const valueToCopy = menuState?.value !== undefined ? menuState.value : nodeValue;
    const jsonString = JSON.stringify(valueToCopy, null, 2);
    navigator.clipboard.writeText(jsonString);
    setMenuState(null);
  }, [nodeValue, menuState]);

  return { menuState, openMenu, closeMenu, copyPath, copyJson };
}
