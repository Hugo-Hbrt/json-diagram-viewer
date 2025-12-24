import { useState, useCallback, useEffect } from 'react';
import { useBreadcrumb } from '../contexts/BreadcrumbContext';
import { isAncestorOf } from '../utils/pathUtils';

interface UseCollapsibleReturn {
  isCollapsed: boolean;
  toggle: () => void;
  expand: () => void;
}

export function useCollapsible(path: (string | number)[], initialState = true): UseCollapsibleReturn {
  const [isCollapsed, setIsCollapsed] = useState(initialState);
  const { path: selectedPath } = useBreadcrumb();

  // Auto-expand if selected path goes through this node
  useEffect(() => {
    if (isCollapsed && isAncestorOf(path, selectedPath)) {
      setIsCollapsed(false);
    }
  }, [selectedPath, path, isCollapsed]);

  const toggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  return { isCollapsed, toggle, expand };
}
