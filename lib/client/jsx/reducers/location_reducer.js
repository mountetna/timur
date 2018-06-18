const locationReducer = (path, action) => {
  if (!path) path = decodeURI(window.location.pathname);
  switch (action.type) {
    case 'UPDATE_LOCATION':
      return decodeURI(action.link);
    default:
      return path;
  };
}

export default locationReducer;
