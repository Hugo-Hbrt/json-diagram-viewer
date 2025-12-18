import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JsonNode } from '../components/JsonNode';

// Mock useCollapsible to return expanded state (matching old default behavior)
vi.mock('../hooks/useCollapsible', () => ({
  useCollapsible: () => ({
    isCollapsed: false,
    toggle: vi.fn(),
  }),
}));

describe('JsonNode snapshot', () => {
  it('renders expanded tree correctly', () => {
    const data = {
      name: 'Test',
      count: 42,
      active: true,
      empty: null,
      nested: {
        city: 'Paris',
        tags: ['a', 'b'],
      },
      items: [
        { id: 1 },
        { id: 2 },
      ],
    };

    const { container } = render(
      <JsonNode nodeKey="root" value={data} path={[]} isRoot />
    );

    expect(container).toMatchSnapshot();
  });
});
