import { showMessages } from './message_actions'
import { requestManifests } from './timur_actions'

export const submitManifest = () => (dispatch, getState) => {
  const { manifest, title } = getState().manifestEditor

  //vaildate title
  if (title === '') {
    return dispatch(showMessages(['Manifest title cannot be blank.']))
  }

  const payload = { manifest, name: title }
  dispatch(
    requestManifests(
      [payload],
      () => dispatch(showMessages(['Manifest succesfully submitted.'])),
      (e) => dispatch(showMessages(['Manifest submission error: ' + e]))
    )
  )
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

const addManifestElementAction = (key, value) => ({
  type: 'ADD_MANIFEST_ELEMENT',
  key,
  value
})

export const addManifestElement = ({ key, value }) => (dispatch, getState) => {
  //vaildate name
  if (Object.keys(getState().manifestEditor.manifest).includes(key)) {
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
    if (Object.keys(getState().manifestEditor.manifest).includes(key)) {
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

  dispatch(addManifestElementAction(key, value))

  //remove the element editor for element
  dispatch(removeFromUpdateList(originalKey))

  //delete old element if key changed
  if (originalKey !== key) {
    dispatch(deleteManifestElement(originalKey))
  }
}

