import uploads from 'etna-js/upload/reducers/upload-reducer';

import {UPDATE_UPLOADS} from 'etna-js/upload/workers/uploader';

const directory = (state, action) => {
  if (!state) {
state = {
      uploads: {},
      fails: [],
      current_folder: null
    };
}

  switch (action.type) {
    case UPDATE_UPLOADS:
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
