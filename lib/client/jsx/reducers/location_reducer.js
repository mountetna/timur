const newLocation = (link) => {
  let url = new URL(link, window.location.href);
  return {
    path: decodeURI(url.pathname),
    search: url.searchParams,
    hash: url.hash ? decodeURI(url.hash) : null
  }
}

const locationReducer = (location, action) => {
  if (!location) location = newLocation(window.location.href);
  switch (action.type) {
    case 'UPDATE_LOCATION':
      return newLocation(action.link);
    default:
      return location;
  };
}

export default locationReducer;
