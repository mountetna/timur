const manifests = (state = {}, action) => {
  switch (action.type) {
    case 'REMOVE_MANIFEST':
      let newState = {...state}
      delete newState[action.id]
      return newState
    case 'LOAD_MANIFESTS':
      return { ...state, ...action.manifestsById }
    case 'ADD_MANIFEST':
    case 'UPDATE_USER_MANIFEST':
      return { ...state, [action.manifest.id]: action.manifest }
    default:
      return state
  }
}

export const manifestsList = (manifests) => Object.keys(manifests).map(id => manifests[id])
export const manifestById = (manifests, id) => manifests[id]

export default manifests
