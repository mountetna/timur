// Class imports.
import { Exchange } from './exchange_actions'

// Module imports.
import { getConsignments } from '../api/timur'
import { showMessages } from './message_actions'

// Add a consignment (the actual JSON data) to the store.
export const addConsignment = (name, consignment)=>{
  return {
    'type': 'ADD_CONSIGNMENT',
    'manifest_name': name,
    'consignment': consignment
  };
};

/*
 * Post a manifest to the query api and send the returned consignment to the
 * store. If things go wrong, show a message with the error.
 */
export const requestConsignments = (manifests, success, error)=>{

  return (dispatch)=>{
    var localSuccess = (response)=>{
      for(var name in response){
        dispatch(addConsignment(name, response[name]));
      }

      if(success != undefined) success(response);
    };

    var localErrorResponse = (response)=>{

      if(response.query){

        var msg = `### For our inquiry:\n\n`;
        msg +=    `\`${JSON.stringify(response.query)}\`\n\n`;
        msg +=    `## this bitter response:\n\n`;
        msg +=    `    ${response.errors}`;
        dispatch(showMessages([msg]));
      }
      else if(response.errors && response.errors.length == 1){

        var msg = `### Our inquest has failed, for this fault:\n\n`;
        msg +=    `    ${response.errors[0]}`;
        dispatch(showMessages([msg]));
      }
      else if(response.errors && response.errors.length > 1){

        var msg = `### Our inquest has failed, for these faults:\n\n`;
        msg +=    `${response.errors.map((error) => `* ${error}`).join('\n')}`;
        dispatch(showMessages([msg]));
      }

      if(error != undefined) error(response);
    };

    var localError = (e)=>{

      e.response.json()
        .then(res);
    };

    var manifest_names = manifests.map(m=>m.name).join(', ');
    var exchng = new Exchange(dispatch, `consignment list ${manifest_names}`);

    getConsignments(manifests, exchng)
      .then(localSuccess)
      .catch(localError);
  };
};
