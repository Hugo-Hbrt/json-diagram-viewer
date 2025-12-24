import { isPrimitive } from "../utils/jsonUtils";
import { useCollapsible } from "../hooks/useCollapsible";
import { CardWrapper } from "./CardWrapper";
import { CardHeader } from "./CardHeader";
import { CardBody } from "./CardBody";
import { PropertyList } from "./PropertyList";
import { ChildrenContainer } from "./ChildrenContainer";

interface ObjectNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  nodeKey: string;
  value: Record<string, unknown>;
  path: (string | number)[];
  cardClass: string;
}

export function ObjectNode({
  nodeKey,
  value,
  path,
  cardClass,
  ...otherProps
}: ObjectNodeProps) {
  const { isCollapsed, toggle } = useCollapsible(path);

  const entries = Object.entries(value);
  const primitives = entries.filter(([, v]) => isPrimitive(v));
  const complex = entries.filter(([, v]) => !isPrimitive(v));

  return (
    <CardWrapper
      cardClass={cardClass}
      isCollapsed={isCollapsed}
      path={path}
      afterCard={
        <ChildrenContainer
          entries={complex}
          path={path}
          isCollapsed={isCollapsed}
        />
      }
      {...otherProps}
    >
      <CardHeader
        title={nodeKey}
        path={path}
        isCollapsed={isCollapsed}
        onToggle={toggle}
        canExpand={complex.length > 0}
        value={value}
      />
      <CardBody path={path} value={value}>
        <PropertyList entries={primitives} path={path} />
        <PropertyList entries={complex} path={path} />
      </CardBody>
    </CardWrapper>
  );
}
