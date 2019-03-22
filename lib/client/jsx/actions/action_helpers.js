import { showMessages } from './message_actions';

export const showErrors = (dispatch)=> (error) =>
  ('response' in error) ?
    error.response.json().then(
    ({errors})=>dispatch(showMessages(errors))
  ) : console.log(error);

export const tryCallback = (cb, response) => cb != undefined && cb(response);

