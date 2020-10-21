require('etna-js/spec/setup');

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
    `http://localhost/${project_name}/view/${model_name}`,
  views_create_path: (project_name) => `http://localhost/${project_name}/views`,
  update_view_json_path: (project_name, view_id) => `http://localhost/${project_name}/views/update/${view_id}`,
};
