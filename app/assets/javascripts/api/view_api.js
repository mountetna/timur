// Module imports.
import {headers, parseJSON, checkStatus} from '../utils/fetch_utils';

export const getView = (model_name, tab_name, exchange)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify({ model_name, tab_name })
  };

  let exchangePromise = exchange.fetch(Routes.view_path(PROJECT_NAME), route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const getUser = (exchange)=>{

  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf')
  };

  let exchangePromise = exchange.fetch(Routes.settings_user_json_path(), route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const updateView = (view_obj, exchange)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(view_obj)
  };

  let exchangePromise = exchange.fetch(Routes.update_view_json_path(PROJECT_NAME), route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const deleteView = (view_obj, exchange)=>{
    let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(view_obj)
  };

  let exchangePromise = exchange.fetch(Routes.delete_view_json_path(PROJECT_NAME), route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};
