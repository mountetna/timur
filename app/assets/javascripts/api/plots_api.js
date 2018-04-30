// Module imports.
import {headers, parseJSON, checkStatus} from '../utils/fetch_utils';

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
    headers: headers('json', 'csrf')
  };
  let route = Routes.plots_fetch_path(PROJECT_NAME);

  return fetch(route, route_opts)
    .then(checkStatus)
    .then(parseJSON);
}

export const createPlot = (plot)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plot)
  };
  let route = Routes.plots_create_path(PROJECT_NAME);

  return fetch(route, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};

export const destroyPlot = (plot)=>{
  let route_opts = {
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    method: 'DELETE'
  };
  let route = Routes.plots_destroy_path(PROJECT_NAME, plot.id);

  return fetch(route, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};

export const updatePlot = (plot)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'PUT',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plot)
  };
  let route = Routes.plots_update_path(PROJECT_NAME, plot.id);

  return fetch(route, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};
