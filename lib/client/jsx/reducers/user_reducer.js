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

const userReducer = function(user, action) {
  if (!user) user = { }
  switch(action.type) {
    case 'ADD_TOKEN_USER':
      return parseToken(action.token);
    default:
      return user;
  }
}

export default userReducer;
