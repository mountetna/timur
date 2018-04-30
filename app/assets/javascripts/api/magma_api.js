import * as FetchUtils from '../utils/fetch_utils';

const create = (name, attributes)=>{
  let element = document.createElement(name);
  for(let key in attributes){
    element.setAttribute(key,attributes[key]);
  }
  return element;
};

const input = (name, value)=>{
  return create('input', {type: 'hidden', name, value})
};

export const getTSVForm = (data)=>{
  let form = create(
    'form',
    {
      action: Routes.magma_retrieve_tsv_path(PROJECT_NAME),
      method: 'POST'
    }
  );

  form.appendChild(
    input('authenticity_token', FetchUtils.headers('csrf')['X-CSRF-Token'])
  );

  // Eliminate null and undefined values.
  data = Object.keys(data)
    .filter(key=>data[key] != undefined && data[key] != null)
    .reduce((obj, key) => ({ ...obj, [key] : data[key] }), {});

  for(let name in data){
    form.appendChild(input(name, data[name]));
  }

  form.style.display = 'none';
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

export const getTSV = (model_name, record_names, exchange)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: FetchUtils.headers('json', 'csrf'),
    body: JSON.stringify({model_name, record_names})
  };

  let fetch_opts = [Routes.magma_retrieve_tsv_path(PROJECT_NAME), route_opts];
  return exchange.fetch(...fetch_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.makeBlob)
    .then(FetchUtils.generateDownload(`${model_name}.tsv`));
};

export const getDocuments = (doc_args, exchange)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: FetchUtils.headers('csrf', 'json'),
    body: JSON.stringify(doc_args)
  };

  let fetch_opts = [Routes.magma_retrieve_path(PROJECT_NAME), route_opts];
  return exchange.fetch(...fetch_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const postRevisions = (revision_data, exchange)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: FetchUtils.headers('csrf'),
    body: revision_data
  };

  let fetch_opts = [Routes.magma_update_path(PROJECT_NAME), route_opts];
  return exchange.fetch(...fetch_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const getAnswer = (question, exchange)=>{
  let route_opts = { 
    method: 'POST',
    credentials: 'same-origin',
    headers: FetchUtils.headers('csrf', 'json'),
    body: JSON.stringify({question})
  };

  let fetch_opts = [Routes.magma_query_path(PROJECT_NAME), route_opts];
  return exchange.fetch(...fetch_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};
