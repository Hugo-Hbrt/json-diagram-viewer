export type JsonValueType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';

export function getValueType(value: unknown): JsonValueType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value as JsonValueType;
}

export function isPrimitive(value: unknown): boolean {
  return value === null || typeof value !== 'object';
}

interface FormattedValue {
  display: string;
  className: string;
}

export function formatValue(value: unknown): FormattedValue {
  const type = getValueType(value);

  switch (type) {
    case 'string':
      return { display: `"${value}"`, className: 'string' };
    case 'number':
      return { display: String(value), className: 'number' };
    case 'boolean':
      return { display: String(value), className: 'boolean' };
    case 'null':
      return { display: 'null', className: 'null' };
    case 'array':
      return { display: `[${(value as unknown[]).length} items]`, className: 'complex' };
    case 'object':
      return { display: `{${Object.keys(value as object).length} keys}`, className: 'complex' };
    default:
      return { display: String(value), className: '' };
  }
}
