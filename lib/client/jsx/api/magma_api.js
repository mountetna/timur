import {
  parseJSON, generateDownload, makeBlob, checkStatus, headers
} from '../utils/fetch_utils';

const magmaPath = (endpoint)=>{
  return `${TIMUR_CONFIG.magma_host}/${endpoint}`;
};

const magmaPost = (params, exchange, endpoint, project_name)=>{

  let route_opts = {
    method: 'POST',
    credentials: 'include',
    headers: headers('json'),
    body: JSON.stringify({
      ...params,
      project_name
    })
  };

  return exchange.fetch(magmaPath(endpoint), route_opts)
    .then(checkStatus)
    .then(parseJSON);
};

const create = (name, attributes)=>{
  let element = document.createElement(name);
  for(let key in attributes){
    element.setAttribute(key,attributes[key]);
  }
  return element;
};

const input = (name, value)=>{
  return create('input', {type: 'hidden', name, value});
};

export const getTSVForm = (model_name, filter, project_name)=>{
  let { Authorization } = headers('auth');
  let data = {
    'X-Etna-Authorization': Authorization,
    project_name,
    model_name,
    record_names: 'all',
    attribute_names: 'all',
    filter,
    format: 'tsv'
  };

  let form = create(
    'form',
    {
      action: magmaPath('retrieve'),
      method: 'POST'
    }
  );

  for (let name in data) {
    let value = data[name];
    if (value != undefined && value != null) {
      form.appendChild(input(name, value));
    }
  }

  form.style.display = 'none';
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

export const getDocuments = (args, exchange, project_name)=>{
  return magmaPost(args, exchange, 'retrieve', project_name);
};

export const postRevisions = (revision_data, exchange, project_name)=>{
  revision_data.append('project_name', project_name);

  let route_opts = {
    method: 'POST',
    credentials: 'include',
    body: revision_data
  };

  return exchange.fetch(magmaPath('update'), route_opts)
    .then(checkStatus)
    .then(parseJSON);
};

export const getAnswer = (question, exchange, project_name)=>{
  return magmaPost(question, exchange, 'query', project_name);
};
