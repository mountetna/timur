export const addTokenUser = (user)=>{
  return {
    type: 'ADD_TOKEN_USER',
    token: Cookies.getItem(TIMUR_CONFIG.token_name)
  };
};

