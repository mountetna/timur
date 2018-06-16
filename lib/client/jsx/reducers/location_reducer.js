const locationReducer = (path, action) => {
  if (!path) path = window.location.pathname;
  switch (action.type) {
    case 'UPDATE_LOCATION':
      return action.link;
    default:
      return path;
  };
}

export default locationReducer;
