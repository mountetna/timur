// Module imports.
import {headers, checkStatus} from 'etna-js/utils/fetch';

export const fetchAllViews = (exchange) => {
  let route_opts = {
    credentials: 'same-origin',
    method: 'GET',
    headers: headers('json', 'csrf')
  };

  let exchangePromise = exchange.fetch(Routes.fetch_view_path(CONFIG.project_name), route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const getView = (model_name, exchange)=>{
  let route_opts = {
    method: 'GET',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
  };

  let exchangePromise = exchange.fetch(Routes.view_path(CONFIG.project_name, model_name), route_opts)
    .then(checkStatus);

  return exchangePromise;
};

export const updateView = (view_obj, exchange)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(view_obj)
  };

  let exchangePromise = exchange.fetch(Routes.update_view_json_path(CONFIG.project_name), route_opts)
    .then(checkStatus);

  return exchangePromise;
};

export const deleteView = (view_obj, exchange)=>{
    let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(view_obj)
  };

  let exchangePromise = exchange.fetch(Routes.delete_view_json_path(CONFIG.project_name), route_opts)
    .then(checkStatus);

  return exchangePromise;
};
