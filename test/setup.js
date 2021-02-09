require('etna-js/spec/setup');

import ReactModal from 'react-modal';
ReactModal.setAppElement('*'); // suppresses modal-related test warnings.

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
