module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/ios/', '/android/'],
  // pnpm 将包放在 .pnpm 下，只忽略不包含 react-native 的 node_modules 路径
  transformIgnorePatterns: [
    'node_modules/(?!.*(react-native|@react-native)(/|$)).*',
  ],
};
