module.exports = {
  globals: {
    fetch: require('node-fetch'),
    CONFIG: {
      project_name: 'labors'
    }
  },
  testURL: 'http://www.fake.com',
  transformIgnorePatterns: ['node_modules/(?!(etna-js)/)'],
  moduleNameMapper: {
    '^service-worker-loader!': '<rootDir>/__mocks__/service-worker-loader.js',
    '^.*[.](css|CSS)$': 'identity-obj-proxy',
    '^react$': '<rootDir>/node_modules/react'
  },
  testMatch: ['**/test/**/?(*.)(spec|test).js?(x)'],
  collectCoverageFrom: ['**/*.js?(x)'],
  setupFilesAfterEnv: ['./test/setup.js'],
  setupFiles: ['raf/polyfill']
};
