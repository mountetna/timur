const loadViews = (state, allViews) => {
  return allViews ? {
    ...state,
    ...allViews.reduce(
      (allViews_by_id, view) => {
        allViews_by_id[view.id] = view;
        return allViews_by_id;
      }, {}
    )
  } : state;
};



const views = (oldViews = {}, action) => {
  switch (action.type) {
    case 'ADD_VIEW':
      return {
        ...oldViews,
        [action.view_id]: action.view
      };
    case 'LOAD_VIEWS':
      return loadViews(oldViews, action.allViews);
    case 'UPDATE_VIEW':
      return { ...oldViews, [action.view.id]: action.view };
    case 'REMOVE_VIEW':
      let newViews = {...oldViews}
      delete newViews[action.id]
      return newViews
    default:
      return oldViews;
  }
};

export default views;


