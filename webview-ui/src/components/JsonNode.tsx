import { useState } from 'react';
import { PropertyList } from './PropertyList';
import { getValueType, isPrimitive, formatValue } from '../utils/jsonUtils';

export type CardType = 'root' | 'array-item' | 'nested-object' | 'array' | 'object';

interface JsonNodeProps {
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
  cardType = 'object',
  isRoot = false,
}: JsonNodeProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const type = getValueType(value);
  const isExpandable = type === 'object' || type === 'array';
  const cardClass = isRoot ? 'root' : cardType;

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (type === 'object' && value !== null) {
    return (
      <ObjectNode
        nodeKey={nodeKey}
        value={value as Record<string, unknown>}
        path={path}
        cardClass={cardClass}
        isExpandable={isExpandable}
        isCollapsed={isCollapsed}
        onToggle={toggleCollapse}
      />
    );
  }

  if (type === 'array') {
    return (
      <ArrayNode
        nodeKey={nodeKey}
        value={value as unknown[]}
        path={path}
        cardClass={cardClass}
        isCollapsed={isCollapsed}
        onToggle={toggleCollapse}
      />
    );
  }

  // Primitive at root level
  const formatted = formatValue(value);
  return (
    <div className="node">
      <div className={`card ${cardClass}`}>
        <div className="card-body">
          <div className="property">
            <span className={`property-value ${formatted.className}`}>
              {formatted.display}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ObjectNodeProps {
  nodeKey: string;
  value: Record<string, unknown>;
  path: (string | number)[];
  cardClass: string;
  isExpandable: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
}

function ObjectNode({
  nodeKey,
  value,
  path,
  cardClass,
  isExpandable,
  isCollapsed,
  onToggle,
}: ObjectNodeProps) {
  const entries = Object.entries(value);
  const primitives = entries.filter(([, v]) => isPrimitive(v));
  const complex = entries.filter(([, v]) => !isPrimitive(v));

  return (
    <div className={`node ${isCollapsed ? 'collapsed' : ''}`}>
      <div className={`card ${cardClass}`}>
        {isExpandable && (
          <div className="card-header" onClick={onToggle}>
            <span>{nodeKey}</span>
            <span className={`toggle ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
          </div>
        )}
        <div className="card-body">
          <PropertyList entries={primitives} />
          <PropertyList entries={complex} />
        </div>
      </div>

      {complex.length > 0 && !isCollapsed && (
        <div className="children-container">
          {complex.map(([k, v]) => {
            const childPath = [...path, k];
            const childType = Array.isArray(v) ? 'array' : 'nested-object';
            return (
              <div key={k} className="child-wrapper">
                <JsonNode
                  nodeKey={k}
                  value={v}
                  path={childPath}
                  cardType={childType}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ArrayNodeProps {
  nodeKey: string;
  value: unknown[];
  path: (string | number)[];
  cardClass: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

function ArrayNode({
  nodeKey,
  value,
  path,
  cardClass,
  isCollapsed,
  onToggle,
}: ArrayNodeProps) {
  return (
    <div className={`node ${isCollapsed ? 'collapsed' : ''}`}>
      <div className={`card ${cardClass}`}>
        <div className="card-header" onClick={onToggle}>
          <span>{nodeKey}</span>
          <span className={`toggle ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
        </div>
        <div className="card-body">
          <div className="property">
            <span className="property-value complex">{value.length} items</span>
          </div>
        </div>
      </div>

      {value.length > 0 && !isCollapsed && (
        <div className="children-container">
          {value.map((item, i) => {
            const childPath = [...path, i];
            const itemLabel = `${nodeKey}[${i}]`;

            if (isPrimitive(item)) {
              const formatted = formatValue(item);
              return (
                <div key={i} className="child-wrapper">
                  <div className="node">
                    <div className="card array-item">
                      <div className="card-header">{itemLabel}</div>
                      <div className="card-body">
                        <div className="property">
                          <span className={`property-value ${formatted.className}`}>
                            {formatted.display}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={i} className="child-wrapper">
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
      )}
    </div>
  );
}
