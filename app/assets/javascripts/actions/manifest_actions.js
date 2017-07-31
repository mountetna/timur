import { showMessages } from './message_actions'
import { addPlot } from './plot_actions'
import { fetchManifests, destroyManifest, createManifest, updateManifest } from '../api/manifests'

// Add retrieved manifests to the store
const loadManifests = (manifestsById) => ({
  type: 'LOAD_MANIFESTS',
  manifestsById
})

// Retrieve all user-visible manifests and send to store
export const requestManifests = () =>
  (dispatch) => {
    fetchManifests()
      .then( ({ manifests }) => {
        const manifestsById = manifests.reduce((acc, manifestJSON) => {

          let manifest = {
            ...manifestJSON,
            // create reference to plots that belong to the manifest
            plotIds: manifestJSON.plots.map(p => p.id)
          }

          // send plots to the store
          manifestJSON.plots.forEach(plot => dispatch(addPlot(plot)))
          delete manifest.plots

          return { ...acc, [manifestJSON.id]: manifest }
        }, {})

        dispatch(loadManifests(manifestsById))
      })
      .catch(e =>  showErrors(e, dispatch))
  }

// remove a manifest from the store
const removeManifest = (id) => ({
  type: 'REMOVE_MANIFEST',
  id
})

// Delete a manifest from the database and the store
export const deleteManifest = (manifestId) =>
  (dispatch) => {
    destroyManifest(manifestId)
      .then(data => {
        dispatch(selectManifest(null))
        dispatch(removeManifest(manifestId))
      })
      .catch(e =>  showErrors(e, dispatch))
  }

const showErrors = (e, dispatch) => {
    e.response.json()
      .then((json) => dispatch(showMessages(json.errors)))
}

// Add a manifest to the store
const addManifest = (manifest) => ({
  type: 'ADD_MANIFEST',
  manifest
})

// Manifest ui editing flag
export const toggleEdit = () =>({
  type: 'TOGGLE_IS_EDITING_MANIFEST'
})

// Post to create new manifest and save in the store
export const saveNewManifest = (manifest) =>
  (dispatch) => {
    createManifest(manifest)
      .then( ({ manifest }) => {
        dispatch(addManifest(manifest))
        dispatch(toggleEdit())
        dispatch(selectManifest(manifest.id))
      })
      .catch(e =>  showErrors(e, dispatch))
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
      })
      .catch(e =>  showErrors(e, dispatch))
  }

export const copyManifest = (manifest) =>
  (dispatch) => {
    createManifest({...manifest, name: `${manifest.name}(copy)`})
      .then(({manifest}) => {
        dispatch(addManifest(manifest))
        dispatch(selectManifest(manifest.id))
        dispatch(toggleEdit())
      })
      .catch(e =>  showErrors(e, dispatch))
  }

// Convert a manifest to its JSON representation for query endpoint
export const manifestToReqPayload = (manifest) => {
  const { name, data: { elements } } = manifest
  const manifestElements = elements.reduce((acc, { name, script }) => {
    if (name !== '' && script !== '') {
      return [...acc, [name, script]]
    }
    return acc
  }, [])

  return { manifest: manifestElements, name: name }
}
