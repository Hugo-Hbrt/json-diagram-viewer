import { useState } from "react";
import { formatValue } from "../utils/jsonUtils";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import { formatPathForCopy } from "../utils/pathUtils";
import { ContextMenu } from "./ContextMenu";

interface PropertyListProps {
  entries: [string, unknown][];
  path: (string | number)[];
}

export function PropertyList({ entries, path }: PropertyListProps) {
  const { setPath } = useBreadcrumb();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; key: string } | null>(null);

  if (entries.length === 0) return null;

  const handleCopyPath = () => {
    if (contextMenu) {
      navigator.clipboard.writeText(formatPathForCopy([...path, contextMenu.key]));
    }
  };

  return (
    <>
      {entries.map(([key, value]) => {
        const formatted = formatValue(value);

        const onClick = () => {
          setPath([...path, key]);
        };

        const onContextMenu = (e: React.MouseEvent) => {
          e.preventDefault();
          setContextMenu({ x: e.clientX, y: e.clientY, key });
        };

        return (
          <div key={key} className="property">
            <span className="property-key" onClick={onClick} onContextMenu={onContextMenu}>
              {key}:
            </span>
            <span className={`property-value ${formatted.className}`}>
              {formatted.display}
            </span>
          </div>
        );
      })}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onCopyPath={handleCopyPath}
        />
      )}
    </>
  );
}
