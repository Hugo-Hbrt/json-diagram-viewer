import { getValueType } from "../utils/jsonUtils";
import { ObjectNode } from "./ObjectNode";
import { ArrayNode } from "./ArrayNode";
import { PrimitiveNode } from "./PrimitiveNode";
import type { CardType } from "./types";

export type { CardType };

interface JsonNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  nodeKey: string;
  value: unknown;
  path: (string | number)[];
  cardType?: CardType;
  isRoot?: boolean;
}

export function JsonNode({
  nodeKey,
  value,
  path,
  cardType = "object",
  isRoot = false,
  ...otherProps
}: JsonNodeProps) {
  const type = getValueType(value);
  const cardClass = isRoot ? "root" : cardType;

  if (type === "object" && value !== null) {
    return (
      <ObjectNode
        nodeKey={nodeKey}
        value={value as Record<string, unknown>}
        path={path}
        cardClass={cardClass}
        {...otherProps}
      />
    );
  }

  if (type === "array") {
    return (
      <ArrayNode
        nodeKey={nodeKey}
        value={value as unknown[]}
        path={path}
        cardClass={cardClass}
        {...otherProps}
      />
    );
  }

  return <PrimitiveNode value={value} cardClass={cardClass} />;
}
