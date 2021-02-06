// Module imports.
import {headers, checkStatus} from 'etna-js/utils/fetch';

export const fetchPlots = ()=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'GET',
    headers: headers('json', 'csrf')
  };
  let route = Routes.fetch_plots_path(CONFIG.project_name);

  return fetch(route, route_opts)
    .then(checkStatus);
}

export const createPlot = (plot)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plot)
  };
  let route = Routes.create_plot_path(CONFIG.project_name);

  return fetch(route, route_opts)
    .then(checkStatus);
};

export const destroyPlot = (plot)=>{
  let route_opts = {
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    method: 'DELETE'
  };
  let route = Routes.destroy_plot_path(CONFIG.project_name, plot.id);

  return fetch(route, route_opts)
    .then(checkStatus);
};

export const getPlot = (exchange) => (plot_id) => {
  return exchange.fetch(
    Routes.get_plot_path(CONFIG.project_name, plot_id)
  )
    .then(checkStatus);
};

export const updatePlot = (plot)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plot)
  };
  let route = Routes.update_plot_path(CONFIG.project_name, plot.id);

  return fetch(route, route_opts)
    .then(checkStatus);
};
