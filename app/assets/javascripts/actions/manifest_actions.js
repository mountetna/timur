import { showMessages } from './message_actions'
import { requestManifests } from './timur_actions'
import { fetchManifests, destroyManifest, createManifest, updateManifest } from '../api/manifests_api'

const loadManifests = (manifestsById) => ({
  type: 'LOAD_MANIFESTS',
  manifestsById
})

export const getManifests = () => 
  (dispatch) => {
    fetchManifests()
      .then( ({ manifests }) => {
        const manifestsById = manifests.reduce((acc, manifestJSON) => {
          return { ...acc, [manifestJSON.id]: manifestJSON }
        }, {})

        dispatch(loadManifests(manifestsById))
      })
      .catch(e => console.error(e))
  }

const removeManifest = (id) => ({
  type: 'REMOVE_MANIFEST',
  id
})

export const deleteManifest = (manifestId) =>
  (dispatch) => {
    destroyManifest(manifestId)
      .then(data => {
        dispatch(selectManifest(null))
        dispatch(removeManifest(manifestId))
      })
      .catch(e => console.error(e))
  }

const addManifest = (manifest) => ({
  type: 'ADD_USER_MANIFEST',
  manifest
})

export const toggleEdit = () =>({
  type: 'TOGGLE_IS_EDITING_MANIFEST'
})

export const saveNewManifest = (manifest) =>
  (dispatch) => {
    createManifest(manifest)
      .then( ({ manifest }) => {
        dispatch(addManifest(manifest))
        dispatch(toggleEdit())
        dispatch(selectManifest(manifest.id))
      })
      .catch(e => console.error(e))
  } 

export const toggleManifestsFilter = (filter) => ({
  type: 'TOGGLE_MANIFESTS_FILTER',
  filter
})

export const selectManifest = (id) => ({
  type: 'SELECT_MANIFEST',
  id
})

const editManifest = (manifest) => ({
  type: 'UPDATE_USER_MANIFEST',
  manifest
})

export const saveManifest = (manifest) =>
  (dispatch) => {
    updateManifest(manifest, manifest.id)
      .then( ({ manifest }) => {
        dispatch(editManifest(manifest))
        dispatch(toggleEdit())
        dispatch(submitManifest(manifest))
      })
      .catch(e => console.error(e))
  }

export const copyManifest = (manifest) =>
  (dispatch) => {
    createManifest({...manifest, name: `${manifest.name}(copy)`})
      .then(({manifest}) => {
        dispatch(addManifest(manifest))
        dispatch(selectManifest(manifest.id))
        dispatch(submitManifest(manifest))
        dispatch(toggleEdit())
      })
      .catch(e => console.error(e))
  }

const addManifestResult = (id, result) => ({
  type: 'ADD_MANIFEST_RESULT',
  id,
  result
})

const manifestToReqPayload = (manifest) => {
  const { name, data: { elements } } = manifest
  const manifestElements = elements.map(({ name, script }) => {
    return [name, script]
  })

  return { manifest: manifestElements, name: name }
}


//TODO
//requestManifests adds the results in the state tree
//probably need to create my own fetch request and refactor the two functions below
export const fetchManifestResults = (manifest, callback) =>
  (dispatch) => {
    dispatch(
      requestManifests(
        [manifestToReqPayload(manifest)],
        callback,
        callback
      )
    )
  }

export const submitManifest = (manifest) =>
  (dispatch) => {
    dispatch(
      requestManifests(
        [manifestToReqPayload(manifest)],
        (result) => dispatch(addManifestResult(manifest.id, result)),
        (error) => dispatch(addManifestResult(manifest.id, error))
      )
    )
  }
