import { headers, parseJSON, checkStatus } from './fetch_utils'

export const plotIndexUrl = (queryParams) => {
  let path = Routes.plots_path(PROJECT_NAME);

  // list of params
  const params = Object.keys(queryParams);

  // append params and values to path
  if (params[0]) {
    path = path + '?';
    params.forEach((param, i) => {
      if (i === 0) {
        path = path + param + '=' + queryParams[param];
      } else {
        path = path + '&' + param + '=' + queryParams[param];
      }
    })
  }

  return path;
};

export const createPlot = (manifestId, plot) =>
  fetch(Routes.manifests_plots_create_path(PROJECT_NAME, manifestId), {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plot)
  })
    .then(checkStatus)
    .then(parseJSON)

export const destroyPlot = (manifestId, plotId) =>
  fetch(Routes.manifests_plots_destroy_path(PROJECT_NAME, manifestId, plotId), {
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    method: 'DELETE'
  })
    .then(checkStatus)
    .then(parseJSON)

export const updatePlot = (manifestId, plotId, plot) =>
  fetch(Routes.manifests_plots_update_path(PROJECT_NAME, manifestId, plotId), {
    credentials: 'same-origin',
    method: 'PUT',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plot)
  })
    .then(checkStatus)
    .then(parseJSON)
