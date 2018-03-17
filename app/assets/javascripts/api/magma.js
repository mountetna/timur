import { headers, parseJSON, generateDownload, makeBlob, checkStatus } from './fetch_utils'

const create = (name, attributes) => {
  let element = document.createElement(name)
  for (let key in attributes) {
    element.setAttribute(key,attributes[key])
  }
  return element
}

const input = (name, value) => create('input', { type: 'hidden', name, value })

export const getTSVForm = (data) => {
  let form = create('form', {
    action: Routes.table_tsv_path(PROJECT_NAME),
    method: 'POST'
  })
  form.appendChild(
    input('authenticity_token', headers('csrf')['X-CSRF-Token'])
  )

  // eliminate null and undefined values
  data = Object.keys(data)
    .filter(key => data[key] != undefined && data[key] != null)
    .reduce((obj, key) => ({ ...obj, [key] : data[key] }), {})

  for (let name in data) {
    form.appendChild( input(name, data[name]))
  }

  form.style.display = 'none'
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

export const getTSV = (model_name, record_names, exchange) =>
  exchange.fetch(
    Routes.table_tsv_path(PROJECT_NAME), 
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers('json', 'csrf'),
      body: JSON.stringify({
        model_name: model_name,
        record_names: record_names
      })
    }
  )
    .then(checkStatus)
    .then(makeBlob)
    .then(generateDownload(`${model_name}.tsv`));

export const getDocuments = ({ model_name, record_names, attribute_names, filter, page, page_size, collapse_tables }, exchange) =>
  exchange.fetch(
    Routes.records_json_path(PROJECT_NAME),
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers('json', 'csrf'),
      body: JSON.stringify({
        model_name,
        record_names,
        attribute_names,
        filter,
        page,
        page_size,
        collapse_tables
      })
    }
  )
    .then(checkStatus)
    .then(parseJSON);

export const postRevisions = (revision_data, exchange)=>{
  var route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('csrf'),
    body: revision_data
  };

  var exchangePromise = exchange.fetch(Routes.update_model_path(PROJECT_NAME), route_opts)
    .then(checkStatus)
    .then(parseJSON)

  return exchangePromise;
};

export const getAnswer = (question, exchange) =>
  exchange.fetch(
    Routes.question_json_path(PROJECT_NAME), 
    { 
      method: 'POST',
      credentials: 'same-origin',
      headers: headers('csrf', 'json'),
      body: JSON.stringify({ question })
    }
  )
    .then(checkStatus)
    .then(parseJSON)
