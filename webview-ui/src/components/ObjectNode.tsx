import { isPrimitive } from '../utils/jsonUtils';
import { useCollapsible } from '../hooks/useCollapsible';
import { CardWrapper } from './CardWrapper';
import { CardHeader } from './CardHeader';
import { PropertyList } from './PropertyList';
import { ChildrenContainer } from './ChildrenContainer';

interface ObjectNodeProps {
  nodeKey: string;
  value: Record<string, unknown>;
  path: (string | number)[];
  cardClass: string;
}

export function ObjectNode({ nodeKey, value, path, cardClass }: ObjectNodeProps) {
  const { isCollapsed, toggle } = useCollapsible();

  const entries = Object.entries(value);
  const primitives = entries.filter(([, v]) => isPrimitive(v));
  const complex = entries.filter(([, v]) => !isPrimitive(v));

  return (
    <CardWrapper cardClass={cardClass} isCollapsed={isCollapsed}>
      <CardHeader title={nodeKey} isCollapsed={isCollapsed} onToggle={toggle} />
      <div className="card-body">
        <PropertyList entries={primitives} />
        <PropertyList entries={complex} />
      </div>
      <ChildrenContainer
        entries={complex}
        path={path}
        isCollapsed={isCollapsed}
      />
    </CardWrapper>
  );
}
