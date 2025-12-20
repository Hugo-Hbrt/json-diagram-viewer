import { formatValue } from "../utils/jsonUtils";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";

interface PropertyListProps {
  entries: [string, unknown][];
  path: (string | number)[];
}

export function PropertyList({ entries, path }: PropertyListProps) {
  const { setPath } = useBreadcrumb();

  if (entries.length === 0) return null;

  return (
    <>
      {entries.map(([key, value]) => {
        const formatted = formatValue(value);

        const onClick = () => {
          setPath([...path, key]);
        };

        return (
          <div key={key} className="property">
            <span className="property-key" onClick={onClick}>
              {key}:
            </span>
            <span className={`property-value ${formatted.className}`}>
              {formatted.display}
            </span>
          </div>
        );
      })}
    </>
  );
}
