import { headers, parseJSON, checkStatus } from './fetch_utils'

export const getView = (model_name, tab_name, exchange)=>{
  var routeOpts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify({ model_name, tab_name })
  };

  var exchangePromise = exchange.fetch(Routes.view_json_path(PROJECT_NAME), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

