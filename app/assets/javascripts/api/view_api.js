// Module imports.
import * as FetchUtils from '../utils/fetch_utils';

export const getView = (model_name, tab_name)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: FetchUtils.headers('json', 'csrf'),
    body: JSON.stringify({ model_name, tab_name })
  };

  let uri = Routes.view_json_path(PROJECT_NAME);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const getUser = ()=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: FetchUtils.headers('json', 'csrf')
  };

  let uri = Routes.settings_user_json_path();
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const updateView = (view_obj)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: FetchUtils.headers('json', 'csrf'),
    body: JSON.stringify(view_obj)
  };

  let uri = Routes.update_view_json_path(PROJECT_NAME);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const deleteView = (view_obj)=>{
    let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: FetchUtils.headers('json', 'csrf'),
    body: JSON.stringify(view_obj)
  };

  let uri = Routes.delete_view_json_path(PROJECT_NAME);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};
