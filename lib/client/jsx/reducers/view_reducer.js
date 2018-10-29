const tabs = (old_tabs = {}, action)=>{
  switch(action['type']) {
    case 'ADD_TAB':

      if(old_tabs['tabs']) old_tabs = old_tabs['tabs'];

      return {
        ...old_tabs,
        [action.tab_name]: action.tab
      };
    default:
      return old_view;
  }
};

const views = (old_views = {}, action)=>{
  switch(action.type){
    case 'ADD_TAB':
      return {
        ...old_views,
        [action.view_name]: {
          tabs: tabs(old_views[action.view_name], action)
        }
      };
    case 'ADD_VIEW':
      return {
        ...old_views,
        [action.view_name]: action.view
      };
    default:
      return old_views;
  }
};

export default views;
