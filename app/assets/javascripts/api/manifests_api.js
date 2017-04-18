import { parseJSON, checkStatus } from './fetch_utils'

export const fetchManifests = () =>
  fetch('/manifests', {
    credentials: 'same-origin'
  })
    .then(checkStatus)
    .then(parseJSON)

export const createManifest = (manifest) =>
  fetch('/manifests', {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(manifest)
  })
    .then(checkStatus)
    .then(parseJSON)

export const destroyManifest = (manifestId) =>
  fetch('/manifests/' + manifestId, {
    credentials: 'same-origin',
    method: 'DELETE'
  })
    .then(checkStatus)
    .then(parseJSON)

export const updateManifest = (manifestUpdates, id) =>
  fetch('/manifests/' + id, {
    credentials: 'same-origin',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(manifestUpdates)
  })
    .then(checkStatus)
    .then(parseJSON)