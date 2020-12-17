const views = (old_views = {}, action)=>{
  switch(action.type){
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
