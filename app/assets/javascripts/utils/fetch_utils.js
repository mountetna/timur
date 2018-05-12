import downloadjs from 'downloadjs';
import Cookies from 'js-cookie';

export const checkStatus = (response)=>{
  if(response.status >= 200 && response.status < 300){
    return response;
  }
  else{
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

export const parseJSON = (response)=>{
  try{
    return response.json();
  }
  catch(err){
    console.log(err);
  }
};

export const makeBlob = (response)=>{
  return response.blob();
};

export const generateDownload = (filename)=>{
  return (blob)=>{
    return downloadjs(blob, filename, blob.type);
  }
};

export const headers = (...types)=>{
  let _headers = {};
  let add = (header, value)=> _headers[header] = value;

  for(let type of types){
    switch(type){
      case 'json':
        add( 'Content-Type', 'application/json');
        break;
      case 'csrf':
        let csrf = document.querySelector('meta[name=csrf-token]');
        if(csrf) add('X-CSRF-Token', csrf.getAttribute('content'));
        break;
      case 'auth':
        let token = Cookies.get(TIMUR_CONFIG.token_name);
        add('Authorization', `Etna ${token}`);
        break;
      default:
        break;
    }
  }

  return _headers;
};
