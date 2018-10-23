import * as Reselect from 'reselect';

export const selectUser = (state)=>{
  if(!('user' in state.timur)) return {};
  return state.timur.user;
};

export const selectUserPermissions = Reselect.createSelector(
  selectUser,
  (user)=>{
    return ('permissions' in user) ? user.permissions : [];
  }
);

export const selectUserProjectRole = Reselect.createSelector(
  selectUserPermissions,
  (permissions) => {
    let perm = permissions.find(
      ({project_name}) => project_name == TIMUR_CONFIG.project_name
    );
    return perm ? perm.role : null
  }
);
