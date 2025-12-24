import { useState } from "react";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import { isAncestorOf, formatPathForCopy } from "../utils/pathUtils";
import { ContextMenu } from "./ContextMenu";

interface CardHeaderProps {
  title: string;
  path: (string | number)[];
  isCollapsed: boolean;
  onToggle: () => void;
  canExpand?: boolean;
}

export function CardHeader({ title, path, isCollapsed, onToggle, canExpand = true }: CardHeaderProps) {
  const { path: selectedPath, setPath } = useBreadcrumb();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(formatPathForCopy(path));
  };

  return (
    <>
      <div className="card-header" onClick={handleTitleClick} onContextMenu={handleContextMenu}>
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
