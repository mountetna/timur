// Module imports.
import {showMessages} from './message_actions';
import {Exchange} from './exchange_actions';
import {
  fetchManifests, createManifest, updateManifest,
  destroyManifest, getConsignments, getConsignmentsByManifestId
} from '../api/manifests_api';

// Add retrieved manifests to the store.
const loadManifests = (manifestsById)=>({
  type: 'LOAD_MANIFESTS',
  manifestsById
});

// Remove a manifest from the store.
const removeManifest = (id)=>({
  type: 'REMOVE_MANIFEST',
  id
});

// Add a manifest to the store.
const addManifest = (manifest)=>({
  type: 'ADD_MANIFEST',
  manifest
});

const editManifest = (manifest) =>({
  type: 'UPDATE_USER_MANIFEST',
  manifest
});

export const toggleManifestsFilter = (filter)=>({
  type: 'TOGGLE_MANIFESTS_FILTER',
  filter
});

export const selectManifest = (id)=>({
  type: 'SELECT_MANIFEST',
  id
});

/*
 * The md5sum of the manifest script is used as an id for the consignment.
 */
export const addConsignment = (md5sum, consignment)=>({
  type: 'ADD_CONSIGNMENT', md5sum, consignment
});

// Retrieve all user-visible manifests and send to store.
export const requestManifests = ()=>{
  return (dispatch)=>{

    let localSuccess = ({manifests})=>{

      // Bail out if there are no manifests.
      if (manifests == null) return;

      // Transform manifests for store.
      let manifests_by_id = manifests.reduce((acc, manifestJSON)=>{
        let manifest = {...manifestJSON};
        delete manifest.plots;
        return {...acc, [manifestJSON.id]: manifest};
      }, {});

      dispatch(loadManifests(manifests_by_id));
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return fetchManifests(new Exchange(dispatch,'request-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

// Delete a manifest from the database and the store.
export const deleteManifest = (manifest, success)=>{
  return (dispatch)=>{
    let localSuccess = (response)=>{
      dispatch(removeManifest(response.manifest.id));
      if (success != undefined) success(response);
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

   return destroyManifest(manifest.id, new Exchange(dispatch, 'delete-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

// Post to create new manifest and save in the store.
export const saveNewManifest = (manifest, success)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(addManifest(response.manifest));
      if (success != undefined) success(response);
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return createManifest(manifest, new Exchange(dispatch, 'save-new-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

export const saveManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(editManifest(response.manifest));
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return updateManifest(manifest, manifest.id, new Exchange(dispatch, 'save-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

export const copyManifest = (manifest, success)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(addManifest(response.manifest));
      if (success != undefined) success(response);
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return createManifest({...manifest, 'name': `${manifest.name}(copy)`}, new Exchange(dispatch, 'copy-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

const consignmentSuccess = (dispatch,success) => (response)=>{
  for(let md5sum in response){
    dispatch(addConsignment(md5sum, response[md5sum]));
  }

  if(success != undefined) success(response);
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
      if(error != undefined) error(response);
    }
  )
  else throw e;
};
/*
 * Post a manifest to the query api and send the returned consignment to the
 * store. If things go wrong, show a message with the error.
 */
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

const showErrors = (e, dispatch)=>{
  if ('response' in e)
    e.response.json()
      .then(json=>dispatch(showMessages([json.error])));
  else
    console.log(e);
};
