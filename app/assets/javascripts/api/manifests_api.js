import { headers, parseJSON, checkStatus } from './fetch_utils'

export const fetchManifests = () =>
  fetch(Routes.manifests_path(), {
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
  })
    .then(checkStatus)
    .then(parseJSON)

export const createManifest = (manifest) =>
  fetch(Routes.manifests_path(), {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(manifest)
  })
    .then(checkStatus)
    .then(parseJSON)

export const destroyManifest = (manifestId) =>
  fetch(Routes.manifest_path(manifestId), {
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    method: 'DELETE'
  })
    .then(checkStatus)
    .then(parseJSON)

export const updateManifest = (manifestUpdates, manifestId) =>
  fetch(Routes.manifest_path(manifestId), {
    credentials: 'same-origin',
    method: 'PUT',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(manifestUpdates)
  })
    .then(checkStatus)
    .then(parseJSON)
