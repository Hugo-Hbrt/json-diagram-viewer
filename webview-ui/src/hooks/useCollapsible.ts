import { useState, useCallback } from 'react';

interface UseCollapsibleReturn {
  isCollapsed: boolean;
  toggle: () => void;
  expand: () => void;
}

export function useCollapsible(initialState = true): UseCollapsibleReturn {
  const [isCollapsed, setIsCollapsed] = useState(initialState);

  const toggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  return { isCollapsed, toggle, expand };
}
