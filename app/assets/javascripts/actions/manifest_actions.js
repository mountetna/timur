import { showMessages } from './message_actions'
import { requestManifests } from './timur_actions'
import { fetchManifests } from '../api/manifests_api'

const loadManifests = (manifestsById) => ({
  type: 'LOAD_MANIFESTS',
  manifestsById
})

export const getManifests = () => 
  () => {
    fetchManifests()
      .then(data => console.log(data))
  } 

export const submitManifest = () => (dispatch, getState) => {
  const { manifest, title, elementList } = getState().manifestsUI

  //vaildate title
  if (title === '') {
    return dispatch(showMessages(['Manifest title cannot be blank.']))
  }

  const orderedManifest = elementList.reduce((acc, elem) => {
    return {...acc, [elem]: manifest[elem]}
  }, {})

  const payload = { manifest: orderedManifest, name: title }
  dispatch(
    requestManifests(
      [payload],
      () => dispatch(showMessages(['Manifest submitted succesfully.'])),
      (e) => dispatch(showMessages(['Manifest submission error: ' + e]))
    )
  )
}

const saveManifestAction = (name, manifest) => ({
  type: 'SAVE_MANIFEST',
  name,
  manifest
})

export const saveManifest = () => (dispatch, getState) => {
  const { manifest, title } = getState().manifestsUI

  //vaildate title
  if (title === '') {
    return dispatch(showMessages(['Manifest title cannot be blank.']))
  }

  const payload = { manifest, name: title }
  dispatch(saveManifestAction(title, payload))
  dispatch(showMessages(['Manifest saved successfully.']))
}

export const toggleIsManifestSelectorVisible = () => ({
  type: 'TOGGLE_IS_MANIFEST_SELECTOR_VISIBLE'
})

const selectManifestAction = ({name, manifest}) => ({
  type: 'SELECT_MANIFEST',
  name,
  manifest
})

const clearManifestEditor = () => ({
  type: 'CLEAR_EDITOR'
})

export const selectManifest = (title) => (dispatch, getState) => {
  if (title === '') {
    dispatch(clearManifestEditor())
    return dispatch(toggleIsManifestSelectorVisible())
  }
  const manifest = getState().manifests[title]
  return dispatch(selectManifestAction(manifest))
}

export const toggleIsTitleUpdating = () => ({
  type: 'TOGGLE_IS_TITLE_UPDATING'
})

export const updateManifestTitle = (title) => ({
  type: 'UPDATE_MANIFEST_TITLE',
  title
})

export const toggleManifestElementEditor = (key = '') => ({
  type: 'TOGGLE_IS_ADDING_MANIFEST_ELEMENT',
  key
})

export const deleteManifestElement = (key) => ({
  type: 'DELETE_MANIFEST_ELEMENT',
  key
})

export const selectManifestElement = (key = '') => ({
  type: 'SELECT_MANIFEST_ELEMENT',
  key
})

export const addToUpdateList = (key) => ({
  type: 'ADD_TO_UPDATING_LIST',
  key
})

export const removeFromUpdateList = (key) => ({
  type: 'REMOVE_FROM_UPDATING_LIST',
  key
})

const addManifestElementAction = (key, value, oldKey) => ({
  type: 'ADD_MANIFEST_ELEMENT',
  key,
  value,
  oldKey
})

export const addManifestElement = ({ key, value }) => (dispatch, getState) => {
  //vaildate name
  if (Object.keys(getState().manifestsUI.manifest).includes(key)) {
    return dispatch(showMessages(['Element name must be unique.']))
  }

  //vaildate name
  if (key === '') {
    return dispatch(showMessages(['Element name cannot be blank.']))
  }

  //vaildate expression
  if (value === '') {
    return dispatch(showMessages(['Element expression cannot be blank.']))
  }

  dispatch(addManifestElementAction(key, value))

  //close manifest element editor
  dispatch(toggleManifestElementEditor())
}


export const updateManifestElement = ({originalKey, key, value }) => (dispatch, getState) => {
  //vaildate name
  if (originalKey !== key) {
    if (Object.keys(getState().manifestsUI.manifest).includes(key)) {
      return dispatch(showMessages(['Element name must be unique.']))
    }
  }

  //vaildate name
  if (key === '') {
    return dispatch(showMessages(['Element name cannot be blank.']))
  }

  //vaildate expression
  if (value === '') {
    return dispatch(showMessages(['Element expression cannot be blank.']))
  }

  dispatch(addManifestElementAction(key, value, originalKey))

  //remove the element editor for element
  dispatch(removeFromUpdateList(originalKey))

  //delete old element if key changed
  if (originalKey !== key) {
    dispatch(deleteManifestElement(originalKey))
  }
}

