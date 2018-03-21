const exchanges = (state = {}, action)=>{
  switch(action.type){
    case 'ADD_EXCHANGE':
      return {
        ...state,
        [action.exchange_name]: action.exchange
      };
    case 'REMOVE_EXCHANGE':
      let newState = {...state};
      delete newState[action.exchange_name];
      return newState;
    default:
      return state;
  }
}

export default exchanges;
