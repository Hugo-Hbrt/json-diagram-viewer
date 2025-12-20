import { ReactNode, useRef, useEffect } from "react";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";

interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  cardClass: string;
  isCollapsed?: boolean;
  children: ReactNode;
  afterCard?: ReactNode;
  path: (string | number)[];
}

function pathsEqual(a: (string | number)[], b: (string | number)[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

export function CardWrapper({
  cardClass,
  isCollapsed = false,
  children,
  afterCard,
  path,
  ...otherProps
}: CardWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { path: selectedPath, scrollTarget, clearScrollTarget } = useBreadcrumb();
  const isSelected = pathsEqual(path, selectedPath);
  const isScrollTarget = scrollTarget !== null && pathsEqual(path, scrollTarget);

  useEffect(() => {
    if (isScrollTarget && ref.current) {
      // Delay scroll to allow layout changes (collapsing nodes) to settle
      const frame = requestAnimationFrame(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        clearScrollTarget();
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isScrollTarget, clearScrollTarget]);

  return (
    <div
      ref={ref}
      className={["node", isCollapsed && "collapsed", isSelected && "selected"]
        .filter(Boolean)
        .join(" ")}
      {...otherProps}
    >
      <div className={`card ${cardClass}`}>{children}</div>
      {afterCard}
    </div>
  );
}
