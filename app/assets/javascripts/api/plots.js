import { headers, parseJSON, checkStatus } from './fetch_utils'

export const createPlot = (manifestId, plot) =>
  fetch(Routes.manifest_plot_path(manifestId, ''), {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plot)
  })
    .then(checkStatus)
    .then(parseJSON)

export const destroyPlot = (manifestId, plotId) =>
  fetch(Routes.manifest_plot_path(manifestId, plotId), {
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    method: 'DELETE'
  })
    .then(checkStatus)
    .then(parseJSON)

export const updatePlot = (manifestId, plotId, plot) =>
  fetch(Routes.manifest_plot_path(manifestId, plotId), {
    credentials: 'same-origin',
    method: 'PUT',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plot)
  })
    .then(checkStatus)
    .then(parseJSON)
