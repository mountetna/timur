// Module imports.
import {combineReducers} from 'redux';

const plotsMap = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PLOT':
      return {
        ...state,
        [action.plot.id]: action.plot
      };
    case 'REMOVE_PLOT':
      let newState = { ...state };
      delete newState[action.id];
      return newState;
    case 'UPDATE_PLOT':
      return {
        ...state,
        [action.plot.id]: action.plot
      };
    default:
      return state;
  }
};

const selected = (state = null, action)=>{
  switch (action.type){
    case 'SELECT_PLOT':
      return action.id;
    default:
      return state;
  }
};

const selectedPoints = (state = [], action)=>{
  switch (action.type) {
    case 'SELECT_POINTS':
      return action.ids;
    case 'SELECT_PLOT':
      return [];
    default:
      return state;
  }
};

export default combineReducers({
  plotsMap,
  selected,
  selectedPoints
});