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
      })
      .catch(e => console.error(e))
  }

export const copyManifest = (manifest) =>
  (dispatch) => {
    createManifest({...manifest, name: `${manifest.name}(copy)`})
      .then(({manifest}) => {
        dispatch(addManifest(manifest))
        dispatch(selectManifest(manifest.id))
        dispatch(toggleEdit())
      })
      .catch(e => console.error(e))
  }

const addManifestResult = (id, result) => ({
  type: 'ADD_MANIFEST_RESULT',
  id,
  result
})

export const submitManifest = (manifest) => (dispatch) => {
  const { name, data: { elements } } = manifest
  const manifestElements = elements.map(({ name, script }) => {
    return [name, script]
  })

  const payload = { manifest: manifestElements, name: name }
  dispatch(
    requestManifests(
      [payload],
      (result) => dispatch(addManifestResult(manifest.id, result)),
      (error) => dispatch(addManifestResult(manifest.id, error))
    )
  )
}

// const saveManifestAction = (name, manifest) => ({
//   type: 'SAVE_MANIFEST',
//   name,
//   manifest
// })

// export const saveManifest = () => (dispatch, getState) => {
//   const { manifest, title } = getState().manifestsUI

//   //vaildate title
//   if (title === '') {
//     return dispatch(showMessages(['Manifest title cannot be blank.']))
//   }

//   const payload = { manifest, name: title }
//   dispatch(saveManifestAction(title, payload))
//   dispatch(showMessages(['Manifest saved successfully.']))
// }

// export const toggleIsManifestSelectorVisible = () => ({
//   type: 'TOGGLE_IS_MANIFEST_SELECTOR_VISIBLE'
// })

// const selectManifestAction = ({name, manifest}) => ({
//   type: 'SELECT_MANIFEST',
//   name,
//   manifest
// })

// const clearManifestEditor = () => ({
//   type: 'CLEAR_EDITOR'
// })

// // export const selectManifest = (title) => (dispatch, getState) => {
// //   if (title === '') {
// //     dispatch(clearManifestEditor())
// //     return dispatch(toggleIsManifestSelectorVisible())
// //   }
// //   const manifest = getState().manifests[title]
// //   return dispatch(selectManifestAction(manifest))
// // }

// export const toggleIsTitleUpdating = () => ({
//   type: 'TOGGLE_IS_TITLE_UPDATING'
// })

// export const updateManifestTitle = (title) => ({
//   type: 'UPDATE_MANIFEST_TITLE',
//   title
// })

// export const toggleManifestElementEditor = (key = '') => ({
//   type: 'TOGGLE_IS_ADDING_MANIFEST_ELEMENT',
//   key
// })

// export const deleteManifestElement = (key) => ({
//   type: 'DELETE_MANIFEST_ELEMENT',
//   key
// })

// export const selectManifestElement = (key = '') => ({
//   type: 'SELECT_MANIFEST_ELEMENT',
//   key
// })

// export const addToUpdateList = (key) => ({
//   type: 'ADD_TO_UPDATING_LIST',
//   key
// })

// export const removeFromUpdateList = (key) => ({
//   type: 'REMOVE_FROM_UPDATING_LIST',
//   key
// })

// const addManifestElementAction = (key, value, oldKey) => ({
//   type: 'ADD_MANIFEST_ELEMENT',
//   key,
//   value,
//   oldKey
// })

// export const addManifestElement = ({ key, value }) => (dispatch, getState) => {
//   //vaildate name
//   if (Object.keys(getState().manifestsUI.manifest).includes(key)) {
//     return dispatch(showMessages(['Element name must be unique.']))
//   }

//   //vaildate name
//   if (key === '') {
//     return dispatch(showMessages(['Element name cannot be blank.']))
//   }

//   //vaildate expression
//   if (value === '') {
//     return dispatch(showMessages(['Element expression cannot be blank.']))
//   }

//   dispatch(addManifestElementAction(key, value))

//   //close manifest element editor
//   dispatch(toggleManifestElementEditor())
// }


// export const updateManifestElement = ({originalKey, key, value }) => (dispatch, getState) => {
//   //vaildate name
//   if (originalKey !== key) {
//     if (Object.keys(getState().manifestsUI.manifest).includes(key)) {
//       return dispatch(showMessages(['Element name must be unique.']))
//     }
//   }

//   //vaildate name
//   if (key === '') {
//     return dispatch(showMessages(['Element name cannot be blank.']))
//   }

//   //vaildate expression
//   if (value === '') {
//     return dispatch(showMessages(['Element expression cannot be blank.']))
//   }

//   dispatch(addManifestElementAction(key, value, originalKey))

//   //remove the element editor for element
//   dispatch(removeFromUpdateList(originalKey))

//   //delete old element if key changed
//   if (originalKey !== key) {
//     dispatch(deleteManifestElement(originalKey))
//   }
// }

