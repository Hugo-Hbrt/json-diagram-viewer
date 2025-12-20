import { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbContextType {
  path: (string | number)[];
  scrollTarget: (string | number)[] | null;
  setPath: (fieldPath: (string | number)[]) => void;
  scrollTo: (fieldPath: (string | number)[]) => void;
  clearScrollTarget: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<(string | number)[]>([]);
  const [scrollTarget, setScrollTarget] = useState<(string | number)[] | null>(null);

  const scrollTo = (fieldPath: (string | number)[]) => {
    setScrollTarget(fieldPath);
  };

  const clearScrollTarget = () => {
    setScrollTarget(null);
  };

  return (
    <BreadcrumbContext.Provider value={{ path, scrollTarget, setPath, scrollTo, clearScrollTarget }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

const defaultContext: BreadcrumbContextType = {
  path: [],
  scrollTarget: null,
  setPath: () => {},
  scrollTo: () => {},
  clearScrollTarget: () => {},
};

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  return context ?? defaultContext;
}
