import { formatValue } from '../utils/jsonUtils';

interface PropertyListProps {
  entries: [string, unknown][];
}

export function PropertyList({ entries }: PropertyListProps) {
  if (entries.length === 0) return null;

  return (
    <>
      {entries.map(([key, value]) => {
        const formatted = formatValue(value);
        return (
          <div key={key} className="property">
            <span className="property-key">{key}:</span>
            <span className={`property-value ${formatted.className}`}>
              {formatted.display}
            </span>
          </div>
        );
      })}
    </>
  );
}
