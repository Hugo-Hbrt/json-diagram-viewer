import { formatValue } from "../utils/jsonUtils";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import { useContextMenu } from "../hooks/useContextMenu";
import { ContextMenu } from "./ContextMenu";

interface PropertyListProps {
  entries: [string, unknown][];
  path: (string | number)[];
}

export function PropertyList({ entries, path }: PropertyListProps) {
  const { setPath } = useBreadcrumb();
  const { menuState, openMenu, closeMenu, copyPath } = useContextMenu(path);

  if (entries.length === 0) return null;

  return (
    <>
      {entries.map(([key, value]) => {
        const formatted = formatValue(value);

        const onClick = () => {
          setPath([...path, key]);
        };

        const onContextMenu = (e: React.MouseEvent) => {
          openMenu(e, key);
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
      {menuState && (
        <ContextMenu
          x={menuState.x}
          y={menuState.y}
          onClose={closeMenu}
          onCopyPath={copyPath}
        />
      )}
    </>
  );
}
