import { JsonNode } from './JsonNode';
import type { CardType } from './types';

interface ChildrenContainerProps {
  entries: [string, unknown][];
  path: (string | number)[];
  isCollapsed: boolean;
}

export function ChildrenContainer({
  entries,
  path,
  isCollapsed,
}: ChildrenContainerProps) {
  if (entries.length === 0 || isCollapsed) {
    return null;
  }

  return (
    <div className="children-container">
      {entries.map(([key, value]) => {
        const childPath = [...path, key];
        const childType: CardType = Array.isArray(value) ? 'array' : 'nested-object';

        return (
          <div key={key} className="child-wrapper">
            <JsonNode
              nodeKey={key}
              value={value}
              path={childPath}
              cardType={childType}
            />
          </div>
        );
      })}
    </div>
  );
}
