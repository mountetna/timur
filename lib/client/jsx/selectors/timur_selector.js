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
