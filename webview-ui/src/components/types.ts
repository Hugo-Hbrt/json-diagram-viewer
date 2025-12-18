export type CardType = 'root' | 'array-item' | 'nested-object' | 'array' | 'object';

export interface JsonNodePath {
  path: (string | number)[];
}

export interface CollapsibleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export interface CardProps {
  cardClass: string;
  children: React.ReactNode;
}

export interface BaseNodeProps extends JsonNodePath {
  nodeKey: string;
  cardType?: CardType;
  isRoot?: boolean;
}
