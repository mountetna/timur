import { headers, generateDownload, parseJSON, makeBlob, checkStatus } from './fetch_utils'

export const getTSV = (model_name, record_names, exchange)=>{

  var routeOpts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify({
      model_name: model_name,
      record_names: record_names
    })
  };

  var exchangePromise = exchange.fetch(Routes.table_tsv_path(PROJECT_NAME), routeOpts)
    .then(checkStatus)
    .then(makeBlob)
    .then(generateDownload(`${model_name}.tsv`));

  return exchangePromise;
};

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

export const getDocuments = (model_name, record_names, attribute_names, collapse_tables, exchange)=>{

  var routeOpts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify({
      model_name,
      record_names,
      attribute_names,
      ...collapse_tables && { collapse_tables: true }
    })
  };

  var exchangePromise = exchange.fetch(Routes.records_json_path(PROJECT_NAME), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const postRevisions = (revision_data, exchange)=>{
  var routeOpts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('csrf'),
    body: revision_data
  };

  var exchangePromise = exchange.fetch(Routes.update_model_path(PROJECT_NAME), routeOpts)
    .then(checkStatus)
    .then(parseJSON)

  return exchangePromise;
};

export const getConsignments = (manifests, exchange)=>{

  var routeOpts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify({
      queries: manifests
    })
  };

  var exchangePromise = exchange.fetch(Routes.query_json_path(PROJECT_NAME), routeOpts)
    .then(checkStatus)
    .then(parseJSON)

  return exchangePromise;
};
