import index from '../reducers/index';
import Cookies from 'js-cookie';

export const addTokenUser = (user)=>{
  return {
    type: 'ADD_TOKEN_USER',
    token: Cookies.get('JANUS_TOKEN')
  };
};