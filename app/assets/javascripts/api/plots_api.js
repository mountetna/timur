// Module imports.
import * as FetchUtils from '../utils/fetch_utils';

export const plotIndexUrl = (queryParams) => {
  let path = Routes.plots_path(PROJECT_NAME);

  // List of params.
  const params = Object.keys(queryParams);

  // Append params and values to path.
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

export const fetchPlots = ()=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: FetchUtils.headers('json', 'csrf')
  };

  let uri = Routes.plots_fetch_path(PROJECT_NAME);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
}

export const createPlot = (plot)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: FetchUtils.headers('json', 'csrf'),
    body: JSON.stringify(plot)
  };

  let uri = Routes.manifests_plots_create_path(PROJECT_NAME);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const destroyPlot = (plot)=>{
  let route_opts = {
    credentials: 'same-origin',
    headers: FetchUtils.headers('json', 'csrf'),
    method: 'DELETE'
  };

  let uri = Routes.manifests_plots_destroy_path(PROJECT_NAME, plot.id);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const updatePlot = (plot)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'PUT',
    headers: FetchUtils.headers('json', 'csrf'),
    body: JSON.stringify(plot)
  };

  let uri = Routes.manifests_plots_update_path(PROJECT_NAME, plot.id);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};
