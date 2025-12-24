import { useState, useCallback } from 'react';
import { formatPathForCopy } from '../utils/pathUtils';

interface MenuState {
  x: number;
  y: number;
  extraKey?: string;
}

interface UseContextMenuReturn {
  menuState: MenuState | null;
  openMenu: (e: React.MouseEvent, extraKey?: string) => void;
  closeMenu: () => void;
  copyPath: () => void;
}

export function useContextMenu(basePath: (string | number)[]): UseContextMenuReturn {
  const [menuState, setMenuState] = useState<MenuState | null>(null);

  const openMenu = useCallback((e: React.MouseEvent, extraKey?: string) => {
    e.preventDefault();
    setMenuState({ x: e.clientX, y: e.clientY, extraKey });
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

  return { menuState, openMenu, closeMenu, copyPath };
}
