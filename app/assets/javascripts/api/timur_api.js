import { headers, generateDownload, makeBlob, checkStatus } from './fetch_utils'

export const getTSV = (model_name, record_names) =>
  fetch(Routes.table_tsv_path(), {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify({
      model_name: model_name,
      record_names: record_names
    })
  })
    .then(checkStatus)
    .then(makeBlob)
    .then(
      generateDownload(`${model_name}.tsv`)
    )
