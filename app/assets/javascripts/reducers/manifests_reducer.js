const manifests = (state = {}, action) => {
  switch (action.type) {
    case 'REMOVE_MANIFEST':
      let newState = {...state};
      delete newState[action.id];
      return newState;
    case 'LOAD_MANIFESTS':
      return { ...state, ...action.manifestsById };
    case 'ADD_MANIFEST':
    case 'UPDATE_USER_MANIFEST':
      return { ...state, [action.manifest.id]: action.manifest };
    default:
      return state;
  }
};

export default manifests;
