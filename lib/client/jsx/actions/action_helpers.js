import { showMessages } from 'etna-js/actions/message_actions';

export const showErrors = (dispatch)=> (error) =>
  ('response' in error) ?
    error.response.json().then(
    ({errors})=>errors && dispatch(showMessages(errors))
  ) : console.log(error);

export const tryCallback = (cb, response) => cb != undefined && cb(response);

