import { headers, generateDownload, parseJSON, makeBlob, checkStatus } from './fetch_utils'

const create = (name, attributes) => {
  let element = document.createElement(name)
  for (let key in attributes) {
    element.setAttribute(key,attributes[key])
  }
  return element
}

const input = (name, value) => create('input', { type: "hidden", name, value })

export const getTSVForm = (data) => {
  let form = create("form", {
    action: Routes.table_tsv_path(),
    method: "POST"
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

  form.style.display = "none"
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

export const getTSV = (model_name, record_names, exchange) =>
  exchange.fetch(
    Routes.table_tsv_path(), 
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

export const getDocuments = ({ model_name, record_names, attribute_names, filter, page, page_size, collapse_tables }, exchange) =>
  exchange.fetch(
    Routes.records_json_path(),
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
