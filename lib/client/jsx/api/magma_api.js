import {
  checkStatus,
  headers
} from 'etna-js/utils/fetch';

const magmaPath = (endpoint) => `${CONFIG.magma_host}/${endpoint}`;

const magmaPost = (endpoint, exchange, params) => {
  return exchange
    .fetch(magmaPath(endpoint), {
      method: 'POST',
      credentials: 'include',
      headers: headers('json'),
      body: JSON.stringify({
        ...params,
        project_name: CONFIG.project_name
      })
    })
    .then(checkStatus);
};

const create = (name, attributes) => {
  let element = document.createElement(name);
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
};

const input = (name, value) => {
  return create('input', {type: 'hidden', name, value});
};

export const getTSVForm = ({
  model_name,
  filter,
  show_disconnected,
  attribute_names
}) => {
  let {Authorization} = headers('auth');
  let data = {
    'X-Etna-Authorization': Authorization,
    project_name: CONFIG.project_name,
    model_name,
    record_names: 'all',
    attribute_names,
    filter,
    show_disconnected,
    format: 'tsv'
  };

  let form = create('form', {
    action: magmaPath('retrieve'),
    method: 'POST'
  });

  for (let name in data) {
    let value = data[name];
    if (value != undefined && value != null) {
      if (value instanceof Array) {
        value.forEach((val) => {
          form.appendChild(input(name + '[]', val));
        });
      } else {
        form.appendChild(input(name, value));
      }
    }
  }

  form.style.display = 'none';
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

export const getDocuments = (doc_args, exchange) => {
  return magmaPost('retrieve', exchange, doc_args);
};

export const postRevisions = (revision_data, exchange) => {
  return magmaPost('update', exchange, revision_data);
};

export const getAnswer = (question, exchange) => {
  return magmaPost('query', exchange, question);
};
