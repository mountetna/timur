const loadManifests = (state, manifests) => {
  return manifests ? {
    ...state,
    ...manifests.reduce(
      (manifests_by_id, manifest) => {
        manifests_by_id[manifest.id] = manifest;
        return manifests_by_id;
      }, {}
    )
  } : state;
};

const manifests = (state = {}, action) => {
  switch (action.type) {
    case 'REMOVE_MANIFEST':
      let newState = {...state};
      delete newState[action.id];
      return newState;
    case 'LOAD_MANIFESTS':
      return loadManifests(state, action.manifests);
    case 'ADD_MANIFEST':
    case 'UPDATE_USER_MANIFEST':
      return { ...state, [action.manifest.id]: action.manifest };
    default:
      return state;
  }
};

export default manifests;
