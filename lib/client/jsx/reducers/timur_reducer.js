const roles = {a: 'administrator', e: 'editor', v: 'viewer'};

const parsePermissions = (perms)=>{
  // Permissions are encoded as 'a:project1,project2;v:project3'
  let permissions = perms.split(/;/).map(perm => {
    let [ role, projects ] = perm.split(/:/);
    role = roles[role.toLowerCase()];
    return projects.split(/,/).map(
      project_name=>({role, project_name})
    )
  }).reduce((perms,perm) => perms.concat(perm), []);

  return permissions;
}

const parseToken = (token)=>{
  let [header, params, signature] = token.split(/\./);
  let {email, first, last, perm} = JSON.parse(atob(params));

  return {
    email,
    first,
    last,
    permissions: parsePermissions(perm)
  };
}

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
    case 'REFRESH_VIEWS':
      return {
        ...old_views,
        ...action.views
      };
    default:
      return old_views;
  }
};

const timurReducer = function(timur, action) {
  if (!timur) timur = { }
  switch(action.type) {
    case 'ADD_TAB':
    case 'ADD_VIEW':
    case 'REFRESH_VIEWS':
      return {
        ...timur,
        views: views(timur.views, action)
      };
    case 'TOGGLE_CONFIG':
      return {
        ...timur,
        [action.key]: timur.hasOwnProperty(action.key) ? !timur[action.key] : true
      };
    case 'ADD_TOKEN_USER':
      return {
        ...timur,
        user: parseToken(action.token)
      };
    default:
      return timur;
  }
}

export default timurReducer;
