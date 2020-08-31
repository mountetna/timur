module.exports = {
  globals: {
    fetch: require('node-fetch'),
    TIMUR_CONFIG: {
      project_name: 'labors',
      magma_host: 'https://magma.test',
    },
    Routes: {
      manifests_fetch_path: (projectName) => `http://localhost/${projectName}/manifests`,
      manifests_destroy_path: (projectName, manifestId) => `http://localhost/${projectName}/manifests/destroy/${manifestId}`,
      manifests_create_path: (projectName) => `http://localhost/${projectName}/manifests/create`,
      manifests_update_path: (projectName, manifestId)=> `http://localhost/${projectName}/manifests/update/${manifestId}`,
      plots_fetch_path: (project_name) => `http://localhost/${project_name}/plots`,
      view_path: (project_name, model_name) => `http://localhost/${project_name}/view/${model_name}`,
    }
  },
  testURL: 'http://localhost',
  transformIgnorePatterns: ['node_modules/(?!(etna-js)/)'],
  moduleNameMapper: {
    '^service-worker-loader!': '<rootDir>/__mocks__/service-worker-loader.js',
    '^.*[.](css|CSS)$': 'identity-obj-proxy',
    '^react$': '<rootDir>/node_modules/react',
    '^react-redux$': '<rootDir>/node_modules/react-redux',
  },
  testMatch: ['**/test/**/?(*.)(spec|test).js?(x)'],
  collectCoverageFrom: ['**/*.js?(x)'],
  setupFilesAfterEnv: ['./test/setup.js'],
  setupFiles: ['raf/polyfill']
};
