// Module imports.
import {showMessages} from './message_actions';
import {Exchange} from './exchange_actions';
import { tryCallback, showErrors } from './action_helpers';
import {
  fetchManifests, createManifest, updateManifest,
  destroyManifest, getConsignments, getConsignmentsByManifestId
} from '../api/manifests_api';

const loadManifests = (manifests)=>({ type: 'LOAD_MANIFESTS', manifests });
const removeManifest = (id)=>({ type: 'REMOVE_MANIFEST', id });
const addManifest = (manifest)=>({ type: 'ADD_MANIFEST', manifest });
const editManifest = (manifest) =>({ type: 'UPDATE_USER_MANIFEST', manifest });

// Retrieve all user-visible manifests and send to store.
export const requestManifests = (success) => (dispatch) =>
  fetchManifests(new Exchange(dispatch,'request-manifest'))
    .then(
      ({manifests})=> {
        dispatch(loadManifests(manifests));
        tryCallback(success, manifests);
      }
    )
    .catch(showErrors(dispatch));

// Delete a manifest from the database and the store.
export const deleteManifest = (manifest, success) => (dispatch) =>
   destroyManifest(manifest.id, new Exchange(dispatch, 'delete-manifest'))
     .then(
       ({manifest})=>{
         dispatch(removeManifest(manifest.id));
         tryCallback(success,manifest);
       }
     )
     .catch(showErrors(dispatch));

// Post to create new manifest and save in the store.
export const saveNewManifest = (manifest, success) => (dispatch) =>
  createManifest(manifest, new Exchange(dispatch, 'save-new-manifest'))
    .then(
      ({manifest})=>{
        dispatch(addManifest(manifest));
        tryCallback(success, manifest);
      }
    )
    .catch(showErrors(dispatch));

export const saveManifest = (manifest, success) => (dispatch)=>
  updateManifest(manifest, manifest.id, new Exchange(dispatch, 'save-manifest'))
    .then(
      ({manifest})=>{
        dispatch(editManifest(manifest));
      }
    )
    .catch(showErrors(dispatch));

export const copyManifest = (manifest, success) => (dispatch) =>
  createManifest(
    {...manifest, 'name': `${manifest.name}(copy)`},
    new Exchange(dispatch, 'copy-manifest')
  ).then(
    ({manifest})=>{
      dispatch(addManifest(manifest));
      tryCallback(success, manifest);
    }
  ).catch(showErrors(dispatch));


// The md5sum of the manifest script is used as an id for the consignment.
export const addConsignment = (md5sum, consignment)=>({
  type: 'ADD_CONSIGNMENT', md5sum, consignment
});


const consignmentSuccess = (dispatch,success) => (response)=>{
  for(let md5sum in response){
    dispatch(addConsignment(md5sum, response[md5sum]));
  }
  tryCallback(success,response);
};

const consignmentError = (dispatch, error) => (e)=>{
  if (e.response) e.response.json().then(
    (response) => {
      if(response.query){

        let msg = `### For our inquiry:\n\n`;
        msg +=    `\`${JSON.stringify(response.query)}\`\n\n`;
        msg +=    `## this bitter response:\n\n`;
        msg +=    `    ${response.error}`;
        dispatch(showMessages([msg]));
      }
      else if(response.error){

        let msg = `### Our inquest has failed, for this fault:\n\n`;
        msg +=    `    ${response.error}`;
        dispatch(showMessages([msg]));
      }
      else if(response.errors){

        let msg = `### Our inquest has failed, for these faults:\n\n`;
        msg +=    `${response.errors.map((error) => `* ${error}`).join('\n')}`;
        dispatch(showMessages([msg]));
      }
      tryCallback(error,response);
    }
  )
  else throw e;
};

export const requestConsignments = (manifests, success, error)=>{
  return (dispatch)=>{
    let exchng = new Exchange(dispatch, 'consignment list');
    getConsignments(manifests, exchng)
      .then(consignmentSuccess(dispatch,success))
      .catch(consignmentError(dispatch, error));
  };
};

export const requestConsignmentsByManifestId = (manifest_ids, record_name, success, error)=>{
  return (dispatch)=>{
    let exchng = new Exchange(dispatch, 'consignment list');
    getConsignmentsByManifestId(manifest_ids, record_name, exchng)
      .then(consignmentSuccess(dispatch,success))
      .catch(consignmentError(dispatch, error));
  }
};
