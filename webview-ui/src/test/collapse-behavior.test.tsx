import { render, screen, fireEvent } from '@testing-library/react';
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

  describe('toggle visibility', () => {
    it('should not render toggle triangle for cards that cannot be expanded', () => {
      const data = {
        name: 'test',
        count: 42,
      };

      const { container } = render(
        <JsonNode nodeKey="root" value={data} path={[]} isRoot />
      );

      // Root card has only primitive properties, so it cannot be expanded
      // and should not show a toggle triangle
      const toggles = container.querySelectorAll('.toggle');
      expect(toggles.length).toBe(0);
    });

    it('should not render toggle triangle for empty array cards', () => {
      const data = {
        items: [],
      };

      const { container } = render(
        <JsonNode nodeKey="root" value={data} path={[]} isRoot />
      );

      // Expand the root to reveal the empty array card
      const rootHeader = container.querySelector('.card-header');
      fireEvent.click(rootHeader!);

      // Root has one complex property (the array), so it shows a toggle
      // But the empty array card itself should not show a toggle
      const toggles = container.querySelectorAll('.toggle');
      expect(toggles.length).toBe(1); // Only root's toggle, not the empty array's
    });
  });
});
