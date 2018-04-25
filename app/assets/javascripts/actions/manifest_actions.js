// Module imports.
import {showMessages} from './message_actions';
import * as ManifestAPI from '../api/manifests_api';
import * as TimurActions from './timur_actions';

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
 * The md5sum is of the json stringified manifest data, which is used as an id
 * for the consignment.
 */
export const addConsignment = (md5sum, consignment)=>{
  return {
    type: 'ADD_CONSIGNMENT',
    manifest_data_md5sum: md5sum,
    consignment: consignment
  };
};

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
      dispatch(TimurActions.popLoaderUI());
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
      dispatch(TimurActions.popLoaderUI());
    };

    return ManifestAPI.fetchManifests()
      .then(localSuccess)
      .catch(localError);

    dispatch(TimurActions.pushLoaderUI());
  };
};

// Delete a manifest from the database and the store.
export const deleteManifest = (manifest_id)=>{
  return (dispatch)=>{

    let localSuccess = (data)=>{
      dispatch(selectManifest(null));
      dispatch(removeManifest(manifest_id));
      dispatch(TimurActions.popLoaderUI());
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
      dispatch(TimurActions.popLoaderUI());
    };

   return ManifestAPI.destroyManifest(manifest_id)
      .then(localSuccess)
      .catch(localError);

    dispatch(TimurActions.pushLoaderUI());
  };
};

// Post to create new manifest and save in the store.
export const saveNewManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(addManifest(response.manifest));
      dispatch(selectManifest(response.manifest.id));
      dispatch(TimurActions.popLoaderUI());
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
      dispatch(TimurActions.popLoaderUI());
    };

    return ManifestAPI.createManifest(manifest)
      .then(localSuccess)
      .catch(localError);

    dispatch(TimurActions.pushLoaderUI());
  };
};

export const saveManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(editManifest(response.manifest));
      dispatch(TimurActions.popLoaderUI());
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
      dispatch(TimurActions.popLoaderUI());
    };

    return ManifestAPI.updateManifest(manifest, manifest.id)
      .then(localSuccess)
      .catch(localError);

    dispatch(TimurActions.pushLoaderUI());
  };
};

export const copyManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(addManifest(response.manifest));
      dispatch(selectManifest(response.manifest.id));
      dispatch(TimurActions.popLoaderUI());
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
      dispatch(TimurActions.popLoaderUI());
    };

    return ManifestAPI.createManifest({...manifest, 'name': `${manifest.name}(copy)`})
      .then(localSuccess)
      .catch(localError);

    dispatch(TimurActions.pushLoaderUI());
  };
};

/*
 * Post a manifest to the query api and send the returned consignment to the
 * store. If things go wrong, show a message with the error.
 */
export const requestConsignments = (manifests, success, error)=>{

  return (dispatch)=>{
    let localSuccess = (response)=>{

      if('error' in response){
        dispatch(showMessages([`There was a ${response.type} error.`]));
        console.log(response.error);
        return;
      }

      /*
       * The md5sum is of the json stringified manifest data, which is used as
       * an id for the consignment.
       */
      for(let md5sum in response){
        dispatch(addConsignment(md5sum, response[md5sum]));
      }

      if(success != undefined) success(response);
      dispatch(TimurActions.popLoaderUI());
    };

    let localErrorResponse = (response)=>{

      if(response.query){

        let msg = `### For our inquiry:\n\n`;
        msg +=    `\`${JSON.stringify(response.query)}\`\n\n`;
        msg +=    `## this bitter response:\n\n`;
        msg +=    `    ${response.errors}`;
        dispatch(showMessages([msg]));
      }
      else if(response.errors && response.errors.length == 1){

        let msg = `### Our inquest has failed, for this fault:\n\n`;
        msg +=    `    ${response.errors[0]}`;
        dispatch(showMessages([msg]));
      }
      else if(response.errors && response.errors.length > 1){

        let msg = `### Our inquest has failed, for these faults:\n\n`;
        msg +=    `${response.errors.map((error) => `* ${error}`).join('\n')}`;
        dispatch(showMessages([msg]));
      }

      if(error != undefined) error(response);
      dispatch(TimurActions.popLoaderUI());
    };

    let localError = (e) => {
      if (e.response) e.response.json().then(localErrorResponse);
      else throw e;
      dispatch(TimurActions.popLoaderUI());
    };

    ManifestAPI.getConsignments(manifests)
      .then(localSuccess)
      .catch(localError);

    dispatch(TimurActions.pushLoaderUI());
  };
};

export const requestConsignmentsByManifestId = (manifest_ids, record_name)=>{

  return (dispatch)=>{

    let localSuccess = (response)=>{

      if('error' in response){
        dispatch(showMessages([`There was a ${response.type} error.`]));
        console.log(response.error);
        return;
      }

      /*
       * The md5sum is of the json stringified manifest data, which is used as
       * an id for the consignment.
       */
      for(let md5sum in response){
        dispatch(addConsignment(md5sum, response[md5sum]));
      }

      dispatch(TimurActions.popLoaderUI());
    };

    let localError = (response)=>{
      console.log(response);
      dispatch(TimurActions.popLoaderUI());
    };

    ManifestAPI.getConsignmentsByManifestId(manifest_ids, record_name)
      .then(localSuccess)
      .catch(localError);

    dispatch(TimurActions.pushLoaderUI());
  }
};

const showErrors = (e, dispatch)=>{
  let localError = (json)=>dispatch(showMessages(json.errors));
  e.response.json()
    .then(localError);
};
