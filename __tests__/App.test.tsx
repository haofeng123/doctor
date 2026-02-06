/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-root-siblings', () => ({
  RootSiblingParent: ({ children }: { children: unknown }) => children,
}));

jest.mock('@/layout', () => {
  const mockReact = require('react');
  const { View, Text } = require('react-native');
  return function MockLayout() {
    return mockReact.createElement(View, { testID: 'layout' }, mockReact.createElement(Text, null, 'Layout'));
  };
});

type TestRoot = ReturnType<typeof ReactTestRenderer.create>;

describe('App', () => {
  it('renders without crashing', async () => {
    let root: TestRoot;
    await ReactTestRenderer.act(async () => {
      root = ReactTestRenderer.create(<App />);
    });
    expect(root!).toBeDefined();
  });

  it('renders Layout inside RootSiblingParent', async () => {
    let root: TestRoot;
    await ReactTestRenderer.act(async () => {
      root = ReactTestRenderer.create(<App />);
    });
    const tree = root!.toJSON();
    expect(tree).toBeDefined();
    const node = Array.isArray(tree) ? tree[0] : tree;
    expect(node && 'type' in node && ['RCTView', 'View'].includes(node.type)).toBe(true);
    expect(root!.root.findByProps({ testID: 'layout' })).toBeDefined();
  });

  it('matches snapshot', async () => {
    let root: TestRoot;
    await ReactTestRenderer.act(async () => {
      root = ReactTestRenderer.create(<App />);
    });
    expect(root!.toJSON()).toMatchSnapshot();
  });
});
