import { createSelector } from 'reselect';

export const selectUser = ({user})=>( user || {} );

export const selectUserPermissions = createSelector(
  selectUser,
  (user)=>{
    return ('permissions' in user) ? user.permissions : [];
  }
);

export const selectUserProjectRole = createSelector(
  selectUserPermissions,
  (permissions) => {
    let perm = permissions[CONFIG.project_name];
    return perm ? perm.role : null
  }
);

export const selectIsEditor = createSelector(
  selectUserProjectRole,
  role => role && (role === 'administrator' || role === 'editor')
);


