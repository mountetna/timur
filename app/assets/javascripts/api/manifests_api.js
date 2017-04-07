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
    body: manifest
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

export const updateManifest = (manifest, id) =>
  fetch('/manifests/' + id, {
    credentials: 'same-origin',
    method: 'PUT',
    body: manifest
  })
    .then(checkStatus)
    .then(parseJSON)