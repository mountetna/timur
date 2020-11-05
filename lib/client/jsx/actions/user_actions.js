export const addTokenUser = (user)=>{
  return {
    type: 'ADD_TOKEN_USER',
    token: Cookies.getItem(CONFIG.token_name)
  };
};

