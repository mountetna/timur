import { showMessages } from './message_actions'
import { requestManifests } from './timur_actions'

export const toggleIsTitleUpdating = () => ({
  type: 'TOGGLE_IS_TITLE_UPDATING'
})

export const updateManifestTitle = (title) => ({
  type: 'UPDATE_MANIFEST_TITLE',
  title
})

export const updateManifest = (manifest) => ({
  type: 'UPDATE_MANIFEST',
  manifest
})

export const submitManifest = () => (dispatch, getState) => {
  const { title, manifest } = getState().manifestEditor

  //vaildate title
  if (title === '') {
    return dispatch(showMessages(['Manifest title cannot be blank']))
  }

    //vaildate title
  if (manifest === '') {
    return dispatch(showMessages(['Manifest cannot be blank']))
  }
  
  //wrap in brackets
  const manifestWithBrackets = `[${manifest}]`

  let jsonManifest
  //validation of json manifest
  try {
      jsonManifest = JSON.parse(manifestWithBrackets)
  } catch(e) {
      dispatch(showMessages(['Not vaild manifest syntax']))
      throw e
  }
  
  dispatch(requestManifests(
    [{ name: title, manifest: jsonManifest }], 
    () => dispatch(showMessages(['Succesfully added manifest'])), 
    () => dispatch(showMessages(['Failed to add manifest']))
  ))
}