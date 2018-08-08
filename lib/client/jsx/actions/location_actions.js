export const updateLocation = (link) => ({ type: 'UPDATE_LOCATION', link });

export const pushLocation = (link) => (dispatch) => {
  history.pushState( {}, '', link );
  dispatch(updateLocation(link))
};

export const setLocation = (link) => (dispatch) => {
  history.replaceState( {}, '', link );
  dispatch(updateLocation(link))
};

