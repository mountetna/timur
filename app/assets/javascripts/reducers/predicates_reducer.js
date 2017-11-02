const predicates = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PREDICATES':
      return {
        ...action.predicates
      };
    default:
      return state;
  };
};

export default predicates;
