const manifestsByName = (state = {}, action) => {
  switch (action.type) {
  	case 'SAVE_MANIFEST':
  	  return {...state, [action.name]: action.manifest}
  	default:
  	  return state
  }
}

export default manifestsByName