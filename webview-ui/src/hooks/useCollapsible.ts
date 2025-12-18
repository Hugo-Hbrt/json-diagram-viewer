import { useState, useCallback } from 'react';

interface UseCollapsibleReturn {
  isCollapsed: boolean;
  toggle: () => void;
}

export function useCollapsible(initialState = true): UseCollapsibleReturn {
  const [isCollapsed, setIsCollapsed] = useState(initialState);

  const toggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  return { isCollapsed, toggle };
}
