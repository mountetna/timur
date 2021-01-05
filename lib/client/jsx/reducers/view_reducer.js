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

const views = (old_views = {}, action)=>{
  switch(action.type){
    case 'ADD_VIEW':
      return {
        ...old_views,
        [action.view_name]: action.view
      };
    case 'LOAD_VIEWS':
      return loadViews(old_views, action.views);
    default:
      return old_views;
  }
};

export default views;
