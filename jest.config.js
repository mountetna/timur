module.exports = {
  globals: {
    fetch: require('node-fetch'),
    CONFIG: {
      project_name: 'labors',
      magma_host: 'https://magma.test'
    }
  },
  testURL: 'http://localhost',
  transformIgnorePatterns: ['node_modules/(?!(etna-js)/)'],
  moduleNameMapper: {
    '^service-worker-loader!': '<rootDir>/__mocks__/service-worker-loader.js',
    '^.*[.](css|CSS)$': 'identity-obj-proxy',
    '^react$': '<rootDir>/node_modules/react',
    '^react-redux$': '<rootDir>/node_modules/react-redux',
    '^react-codemirror2$': '<rootDir>/node_modules/react-codemirror2',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^react-modal$': '<rootDir>/node_modules/react-modal',
    '^enzyme$': '<rootDir>/node_modules/enzyme',
    '^enzyme-adapter-react-16$':
      '<rootDir>/node_modules/enzyme-adapter-react-16'
  },
  testMatch: ['**/test/**/?(*.)(spec|test).js?(x)'],
  collectCoverageFrom: ['**/*.js?(x)'],
  setupFilesAfterEnv: ['./test/setup.js'],
  setupFiles: ['raf/polyfill']
};
