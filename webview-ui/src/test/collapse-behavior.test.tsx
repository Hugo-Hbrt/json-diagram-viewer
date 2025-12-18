import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { JsonNode } from '../components/JsonNode';

describe('Collapse behavior', () => {
  describe('all nodes should be collapsed by default', () => {
    it('should not render children containers when an object node is first rendered', () => {
      const data = {
        name: 'root',
        nested: {
          child: 'value',
        },
      };

      const { container } = render(
        <JsonNode nodeKey="root" value={data} path={[]} isRoot />
      );

      // Children containers should not be rendered because nodes are collapsed by default
      const childrenContainers = container.querySelectorAll('.children-container');
      expect(childrenContainers.length).toBe(0);
    });

    it('should not render array children when an array node is first rendered', () => {
      const data = {
        items: [
          { id: 1, name: 'first' },
          { id: 2, name: 'second' },
        ],
      };

      const { container } = render(
        <JsonNode nodeKey="root" value={data} path={[]} isRoot />
      );

      // Array item labels should not be visible because the node should be collapsed
      expect(screen.queryByText('items[0]')).not.toBeInTheDocument();
      expect(screen.queryByText('items[1]')).not.toBeInTheDocument();

      // No children containers should be rendered
      const childrenContainers = container.querySelectorAll('.children-container');
      expect(childrenContainers.length).toBe(0);
    });

    it('should not render any children containers for deeply nested data', () => {
      const data = {
        level1: {
          level2: {
            level3: {
              deepValue: 'hidden',
            },
          },
        },
      };

      const { container } = render(
        <JsonNode nodeKey="root" value={data} path={[]} isRoot />
      );

      // All nodes collapsed means no children containers anywhere
      const childrenContainers = container.querySelectorAll('.children-container');
      expect(childrenContainers.length).toBe(0);
    });

    it('should show collapsed indicator in card header', () => {
      const data = {
        nested: {
          child: 'value',
        },
      };

      const { container } = render(
        <JsonNode nodeKey="root" value={data} path={[]} isRoot />
      );

      // Nodes should have the 'collapsed' class when collapsed
      const collapsedNodes = container.querySelectorAll('.node.collapsed');
      expect(collapsedNodes.length).toBeGreaterThan(0);
    });
  });
});
