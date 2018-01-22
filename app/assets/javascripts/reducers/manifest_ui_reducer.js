// Module imports.
import {combineReducers} from 'redux';

const filter = (state = null, action)=>{
  switch (action.type){
    case 'TOGGLE_MANIFESTS_FILTER':
      if (state === action.filter) {
        return null;
      }
      return action.filter;
    default:
      return state;
  }
};

const selected = (state = null, action)=>{
  switch (action.type){
    case 'SELECT_MANIFEST':
      return action.id;
    default:
      return state;
  }
};

export default combineReducers({
  filter,
  selected,
});
