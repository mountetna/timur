const view = (current_view) => {
  if (Object.keys(current_view.tabs).length > 0) return current_view;
  return {
    ...current_view,
    tabs: {
      default: {
        name: 'default',
        index_order: 0,
        panes: {
          default: {
            name: 'default',
            index_order: 0,
            attributes: { }
          }
        }
      }
    }
  }
}

const views = (old_views = {}, action)=>{
  switch(action.type){
    case 'ADD_VIEW':
      return {
        ...old_views,
        [action.view_name]: view(action.view)
      };
    default:
      return old_views;
  }
};

export default views;
