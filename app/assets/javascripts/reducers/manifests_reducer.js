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
    case 'REMOVE_PLOT':
      const { manifestId, id } = action;
      return {
        ...state,
        [manifestId]: {
          ...state[manifestId],
          plotIds: state[manifestId].plotIds.filter(plotId => id != plotId)
        }
      };
    default:
      return state;
  }
};

export default manifests;
