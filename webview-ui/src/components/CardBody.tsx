import { ReactNode } from "react";
import { useContextMenu } from "../hooks/useContextMenu";
import { ContextMenu } from "./ContextMenu";

interface CardBodyProps {
  path: (string | number)[];
  value: unknown;
  children: ReactNode;
}

export function CardBody({ path, value, children }: CardBodyProps) {
  const { menuState, openMenu, closeMenu, copyPath, copyJson } = useContextMenu(path, value);

  const handleContextMenu = (e: React.MouseEvent) => {
    openMenu(e);
  };

  return (
    <>
      <div className="card-body" onContextMenu={handleContextMenu}>
        {children}
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
