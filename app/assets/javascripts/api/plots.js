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

export const createPlot = (plot) =>
  fetch(Routes.manifests_plots_create_path(PROJECT_NAME), {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plot)
  })
    .then(checkStatus)
    .then(parseJSON)

export const destroyPlot = (plot) =>
  fetch(Routes.manifests_plots_destroy_path(PROJECT_NAME, plot.id), {
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    method: 'DELETE'
  })
    .then(checkStatus)
    .then(parseJSON)

export const updatePlot = (plot) =>
  fetch(Routes.manifests_plots_update_path(PROJECT_NAME, plot.id), {
    credentials: 'same-origin',
    method: 'PUT',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plot)
  })
    .then(checkStatus)
    .then(parseJSON)