import * as assert from 'assert';

// These functions mirror the webview rendering logic for unit testing
function getValueType(value: unknown): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

function formatValue(value: unknown): { display: string; class: string } {
    const type = getValueType(value);
    switch (type) {
        case 'string':
            return { display: '"' + String(value) + '"', class: 'string' };
        case 'number':
            return { display: String(value), class: 'number' };
        case 'boolean':
            return { display: String(value), class: 'boolean' };
        case 'null':
            return { display: 'null', class: 'null' };
        case 'array':
            return { display: '[' + (value as unknown[]).length + ' items]', class: 'complex' };
        case 'object':
            return { display: '{' + Object.keys(value as object).length + ' keys}', class: 'complex' };
        default:
            return { display: String(value), class: '' };
    }
}

function isPrimitive(value: unknown): boolean {
    return value === null || typeof value !== 'object';
}

suite('Rendering Logic Test Suite', () => {

    suite('getValueType', () => {
        test('should identify null', () => {
            assert.strictEqual(getValueType(null), 'null');
        });

        test('should identify arrays', () => {
            assert.strictEqual(getValueType([]), 'array');
            assert.strictEqual(getValueType([1, 2, 3]), 'array');
        });

        test('should identify strings', () => {
            assert.strictEqual(getValueType('hello'), 'string');
            assert.strictEqual(getValueType(''), 'string');
        });

        test('should identify numbers', () => {
            assert.strictEqual(getValueType(42), 'number');
            assert.strictEqual(getValueType(0), 'number');
            assert.strictEqual(getValueType(-3.14), 'number');
        });

        test('should identify booleans', () => {
            assert.strictEqual(getValueType(true), 'boolean');
            assert.strictEqual(getValueType(false), 'boolean');
        });

        test('should identify objects', () => {
            assert.strictEqual(getValueType({}), 'object');
            assert.strictEqual(getValueType({ a: 1 }), 'object');
        });
    });

    suite('formatValue', () => {
        test('should format strings with quotes', () => {
            const result = formatValue('hello');
            assert.strictEqual(result.display, '"hello"');
            assert.strictEqual(result.class, 'string');
        });

        test('should format numbers', () => {
            const result = formatValue(42);
            assert.strictEqual(result.display, '42');
            assert.strictEqual(result.class, 'number');
        });

        test('should format booleans', () => {
            assert.strictEqual(formatValue(true).display, 'true');
            assert.strictEqual(formatValue(false).display, 'false');
            assert.strictEqual(formatValue(true).class, 'boolean');
        });

        test('should format null', () => {
            const result = formatValue(null);
            assert.strictEqual(result.display, 'null');
            assert.strictEqual(result.class, 'null');
        });

        test('should format arrays with item count', () => {
            const result = formatValue([1, 2, 3]);
            assert.strictEqual(result.display, '[3 items]');
            assert.strictEqual(result.class, 'complex');
        });

        test('should format empty arrays', () => {
            const result = formatValue([]);
            assert.strictEqual(result.display, '[0 items]');
        });

        test('should format objects with key count', () => {
            const result = formatValue({ a: 1, b: 2 });
            assert.strictEqual(result.display, '{2 keys}');
            assert.strictEqual(result.class, 'complex');
        });

        test('should format empty objects', () => {
            const result = formatValue({});
            assert.strictEqual(result.display, '{0 keys}');
        });
    });

    suite('isPrimitive', () => {
        test('should return true for null', () => {
            assert.strictEqual(isPrimitive(null), true);
        });

        test('should return true for strings', () => {
            assert.strictEqual(isPrimitive('hello'), true);
        });

        test('should return true for numbers', () => {
            assert.strictEqual(isPrimitive(42), true);
        });

        test('should return true for booleans', () => {
            assert.strictEqual(isPrimitive(true), true);
        });

        test('should return false for arrays', () => {
            assert.strictEqual(isPrimitive([]), false);
        });

        test('should return false for objects', () => {
            assert.strictEqual(isPrimitive({}), false);
        });
    });

    suite('JSON Parsing Edge Cases', () => {
        test('should handle valid JSON', () => {
            const json = '{"name": "test"}';
            const parsed = JSON.parse(json);
            assert.deepStrictEqual(parsed, { name: 'test' });
        });

        test('should handle nested JSON', () => {
            const json = '{"outer": {"inner": {"deep": 42}}}';
            const parsed = JSON.parse(json);
            assert.strictEqual(parsed.outer.inner.deep, 42);
        });

        test('should handle arrays in JSON', () => {
            const json = '{"items": [1, 2, 3]}';
            const parsed = JSON.parse(json);
            assert.deepStrictEqual(parsed.items, [1, 2, 3]);
        });

        test('should throw on invalid JSON', () => {
            const json = '{invalid}';
            assert.throws(() => JSON.parse(json));
        });

        test('should handle all primitive types', () => {
            const json = '{"str": "text", "num": 42, "bool": true, "nil": null}';
            const parsed = JSON.parse(json);
            assert.strictEqual(typeof parsed.str, 'string');
            assert.strictEqual(typeof parsed.num, 'number');
            assert.strictEqual(typeof parsed.bool, 'boolean');
            assert.strictEqual(parsed.nil, null);
        });
    });
});
