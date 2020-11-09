require('etna-js/spec/setup');

import ReactModal from 'react-modal';
ReactModal.setAppElement('*'); // suppresses modal-related test warnings.

global.Routes = {
  manifests_fetch_path: (projectName) =>
    `http://localhost/${projectName}/manifests`,
  manifests_destroy_path: (projectName, manifestId) =>
    `http://localhost/${projectName}/manifests/destroy/${manifestId}`,
  manifests_create_path: (projectName) =>
    `http://localhost/${projectName}/manifests/create`,
  manifests_update_path: (projectName, manifestId) =>
    `http://localhost/${projectName}/manifests/update/${manifestId}`,
  plots_fetch_path: (project_name) => `http://localhost/${project_name}/plots`,
  view_path: (project_name, model_name) =>
    `http://localhost/${project_name}/view/${model_name}`
};
