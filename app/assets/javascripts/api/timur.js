import { headers, generateDownload, parseJSON, makeBlob, checkStatus } from './fetch_utils'

export const getTSV = (model_name, record_names, exchange)=>{

  var routeOpts = {
    'method': 'POST',
    'credentials': 'same-origin',
    'headers': headers('json', 'csrf'),
    'body': JSON.stringify({
      'model_name': model_name,
      'record_names': record_names
    })
  };

  var exchangePromise = exchange.fetch(Routes.table_tsv_path(), routeOpts)
    .then(checkStatus)
    .then(makeBlob)
    .then(generateDownload(`${model_name}.tsv`));

  return exchangePromise;
};

export const getView = (project_name, model_name, tab_name, exchange)=>{

  var routeOpts = {
    'method': 'POST',
    'credentials': 'same-origin',
    'headers': headers('json', 'csrf'),
    'body': JSON.stringify({
      'project_name': 'Ipi',
      'model_name': model_name,
      'tab_name': tab_name
    })
  };

  var exchangePromise = exchange.fetch(Routes.view_json_path(), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const getDocuments = (project_name, model_name, record_names, attribute_names, collapse_tables, exchange)=>{

  var routeOpts = {
    'method': 'POST',
    'credentials': 'same-origin',
    'headers': headers('json', 'csrf'),
    'body': JSON.stringify({
      'project_name': project_name,
      'model_name': model_name,
      'record_names': record_names,
      'attribute_names': attribute_names,
      ...collapse_tables && { 'collapse_tables': true }
    })
  };

  var exchangePromise = exchange.fetch(Routes.records_json_path(), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const postRevisions = (revision_data, exchange)=>{

  var routeOpts = {
    'method': 'POST',
    'credentials': 'same-origin',
    'headers': headers('csrf'),
    'body': revision_data
  };

  var exchangePromise = exchange.fetch(Routes.update_model_path(), routeOpts)
    .then(checkStatus)
    .then(parseJSON)

  return exchangePromise;
};

export const getConsignments = (project_name, manifests, exchange)=>{

  var routeOpts = {
    'method': 'POST',
    'credentials': 'same-origin',
    'headers': headers('json', 'csrf'),
    'body': JSON.stringify({
      'queries': manifests,
      'project_name': project_name
    })
  };

  var exchangePromise = exchange.fetch(Routes.query_json_path(), routeOpts)
    .then(checkStatus)
    .then(parseJSON)

  return exchangePromise;
};
