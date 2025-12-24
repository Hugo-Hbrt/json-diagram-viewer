import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import { isAncestorOf } from "../utils/pathUtils";
import { useContextMenu } from "../hooks/useContextMenu";
import { ContextMenu } from "./ContextMenu";

interface CardHeaderProps {
  title: string;
  path: (string | number)[];
  isCollapsed: boolean;
  onToggle: () => void;
  canExpand?: boolean;
  value?: unknown;
}

export function CardHeader({ title, path, isCollapsed, onToggle, canExpand = true, value }: CardHeaderProps) {
  const { path: selectedPath, setPath } = useBreadcrumb();
  const { menuState, openMenu, closeMenu, copyPath, copyJson } = useContextMenu(path, value);

  const handleTitleClick = () => {
    if (isCollapsed) onToggle(); // Expand if collapsed
    setPath(path);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // When collapsing, update breadcrumb if selected path is a descendant
    if (!isCollapsed && isAncestorOf(path, selectedPath)) {
      setPath(path);
    }
    onToggle();
  };

  return (
    <>
      <div className="card-header" onClick={handleTitleClick} onContextMenu={openMenu}>
        <span>{title}</span>
        {canExpand && (
          <span
            className={`toggle ${isCollapsed ? "collapsed" : ""}`}
            onClick={handleToggleClick}
          >
            ▼
          </span>
        )}
      </div>
      {menuState && (
        <ContextMenu
          x={menuState.x}
          y={menuState.y}
          onClose={closeMenu}
          onCopyPath={copyPath}
          onCopyJson={copyJson}
        />
      )}
    </>
  );
}
