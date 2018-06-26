// Module imports.
import {headers, parseJSON, checkStatus} from '../utils/fetch_utils';

export const getView = (model_name, exchange)=>{
  let route_opts = {
    method: 'GET',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
  };

  let uri = Routes.retrieve_view_path(TIMUR_CONFIG.project_name, model_name);
  return exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};

export const updateView = (view_obj, exchange)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(view_obj)
  };

  let uri = Routes.update_view_path(TIMUR_CONFIG.project_name);
  return exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};

export const deleteView = (view_obj, exchange)=>{
    let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(view_obj)
  };

  let uri = Routes.delete_view_path(TIMUR_CONFIG.project_name);
  return exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};
