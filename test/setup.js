require('etna-js/spec/setup');

import ReactModal from 'react-modal';
ReactModal.setAppElement('*'); // suppresses modal-related test warnings.

// To get CodeMirror to work correctly during tests:
// https://github.com/jsdom/jsdom/issues/3002
document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = jest.fn();

  range.getClientRects = () => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: jest.fn()
    };
  };

  return range;
};

// To stabilize Material UI / random IDs for snapshot testing
// https://github.com/mui-org/material-ui/issues/21293
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;
global.CONFIG = {
  project_name: 'labors',
  magma_host: 'https://magma.test'
};

global.Routes = {
  fetch_manifests_path: (projectName) =>
    `http://localhost/${projectName}/manifests`,
  destroy_manifest_path: (projectName, manifestId) =>
    `http://localhost/${projectName}/manifests/destroy/${manifestId}`,
  create_manifest_path: (projectName) =>
    `http://localhost/${projectName}/manifests/create`,
  update_manifest_path: (projectName, manifestId) =>
    `http://localhost/${projectName}/manifests/update/${manifestId}`,
  plots_fetch_path: (project_name) => `http://localhost/${project_name}/plots`,
  get_view_path: (project_name, model_name) =>
    `http://localhost/${project_name}/view/${model_name}`,
  browse_model_path: (project_name, model_name, record_name) =>
    `http://localhost/${project_name}/browse/${model_name}/${record_name}`
};
