// This should probably be extracted from Metis
//   and put into etna-js, but Timur doesn't
//   have any knowledge about directories...

import uploads from 'etna-js/upload/reducers/upload-reducer';

import {
  UPLOAD_STATUS,
  UPLOAD_SPEED,
  ADD_UPLOAD,
  REMOVE_UPLOAD
} from 'etna-js/upload/actions/upload_actions';

const directory = (state, action) => {
  if (!state)
    state = {
      uploads: {}
    };

  switch (action.type) {
    case UPLOAD_STATUS:
    case UPLOAD_SPEED:
    case ADD_UPLOAD:
    case REMOVE_UPLOAD:
      return {
        ...state,
        uploads: uploads(state.uploads, action)
      };
    default:
      return state;
      break;
  }
};

export default directory;
