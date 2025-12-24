import { useEffect, useRef } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCopyPath: () => void;
  onCopyJson: () => void;
}

export function ContextMenu({ x, y, onClose, onCopyPath, onCopyJson }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Defer adding listeners to avoid catching the event that opened the menu
    const frame = requestAnimationFrame(() => {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("contextmenu", handleClickOutside);
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("contextmenu", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
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
      <button
        onClick={() => {
          onCopyJson();
          onClose();
        }}
      >
        Copy JSON
      </button>
    </div>
  );
}
