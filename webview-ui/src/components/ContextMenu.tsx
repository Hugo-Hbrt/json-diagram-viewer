interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCopyPath: () => void;
}

export function ContextMenu({ x, y, onClose, onCopyPath }: ContextMenuProps) {
  return (
    <div
      className="context-menu"
      style={{ position: "fixed", left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          onCopyPath();
          onClose();
        }}
      >
        Copy Path
      </button>
    </div>
  );
}
