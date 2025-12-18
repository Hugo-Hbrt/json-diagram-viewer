import { isPrimitive } from '../utils/jsonUtils';
import { useCollapsible } from '../hooks/useCollapsible';
import { CardWrapper } from './CardWrapper';
import { CardHeader } from './CardHeader';
import { PrimitiveNode } from './PrimitiveNode';
import { JsonNode } from './JsonNode';

interface ArrayNodeProps {
  nodeKey: string;
  value: unknown[];
  path: (string | number)[];
  cardClass: string;
}

export function ArrayNode({ nodeKey, value, path, cardClass }: ArrayNodeProps) {
  const { isCollapsed, toggle } = useCollapsible();

  return (
    <CardWrapper cardClass={cardClass} isCollapsed={isCollapsed}>
      <CardHeader title={nodeKey} isCollapsed={isCollapsed} onToggle={toggle} />
      <div className="card-body">
        <div className="property">
          <span className="property-value complex">{value.length} items</span>
        </div>
      </div>
      <ArrayChildren
        items={value}
        path={path}
        parentKey={nodeKey}
        isCollapsed={isCollapsed}
      />
    </CardWrapper>
  );
}

interface ArrayChildrenProps {
  items: unknown[];
  path: (string | number)[];
  parentKey: string;
  isCollapsed: boolean;
}

function ArrayChildren({ items, path, parentKey, isCollapsed }: ArrayChildrenProps) {
  if (items.length === 0 || isCollapsed) {
    return null;
  }

  return (
    <div className="children-container">
      {items.map((item, index) => {
        const childPath = [...path, index];
        const itemLabel = `${parentKey}[${index}]`;

        if (isPrimitive(item)) {
          return (
            <div key={index} className="child-wrapper">
              <PrimitiveNode value={item} cardClass="array-item" label={itemLabel} />
            </div>
          );
        }

        return (
          <div key={index} className="child-wrapper">
            <JsonNode
              nodeKey={itemLabel}
              value={item}
              path={childPath}
              cardType="array-item"
            />
          </div>
        );
      })}
    </div>
  );
}
