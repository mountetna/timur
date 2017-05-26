const manifestsById = (state = {}, action) => {
  switch (action.type) {
    case 'REMOVE_MANIFEST':
      let newState = {...state}
      delete newState[action.id]
      return newState
    case 'LOAD_MANIFESTS':
      return { ...state, ...action.manifestsById }
    case 'ADD_USER_MANIFEST':
    case 'UPDATE_USER_MANIFEST':
      return { ...state, [action.manifest.id]: action.manifest }
    case 'ADD_MANIFEST_RESULT':
      return {
        ...state, [action.id]: {
          ...state[action.id],
          result: action.result
        }
      }
    default:
      return state
  }
}

export default manifestsById
