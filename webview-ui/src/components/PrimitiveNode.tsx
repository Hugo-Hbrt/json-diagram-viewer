import { formatValue } from '../utils/jsonUtils';
import { CardWrapper } from './CardWrapper';

interface PrimitiveNodeProps {
  value: unknown;
  cardClass: string;
  label?: string;
}

export function PrimitiveNode({ value, cardClass, label }: PrimitiveNodeProps) {
  const formatted = formatValue(value);

  return (
    <CardWrapper cardClass={cardClass}>
      {label && <div className="card-header">{label}</div>}
      <div className="card-body">
        <div className="property">
          <span className={`property-value ${formatted.className}`}>
            {formatted.display}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
}
