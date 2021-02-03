import {parseToken} from 'etna-js/utils/janus'

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
