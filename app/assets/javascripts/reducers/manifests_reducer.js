const manifestsById = (state = {}, action) => {
  switch (action.type) {
    case 'LOAD_MANIFESTS':
      return action.manifestsById
  	case 'SAVE_MANIFEST':
  	  return {...state, [action.name]: action.manifest}
  	default:
  	  return state
  }
}

export default manifestsById