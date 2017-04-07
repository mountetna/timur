const manifestsById = (state = {}, action) => {
  switch (action.type) {
    case 'REMOVE_MANIFEST':
      let newState = {...state}
      delete newState[action.id]
      return newState
    case 'LOAD_MANIFESTS':
      return { ...state, ...action.manifestsById }
  	case 'SAVE_MANIFEST':
  	  return { ...state, [action.name]: action.manifest }
  	default:
  	  return state
  }
}

export default manifestsById