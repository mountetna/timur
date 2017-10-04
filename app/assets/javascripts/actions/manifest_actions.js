import { showMessages } from './message_actions'
import { loadPlot } from './plot_actions'
import { Exchange } from './exchange_actions';
import { getConsignments, fetchManifests, destroyManifest, createManifest, updateManifest} from '../api/manifests';

const showErrors = (e, dispatch)=>{
  let localError = (json)=>dispatch(showMessages(json.errors));
  e.response.json()
    .then(localError);
}

// Add retrieved manifests to the store.
const loadManifests = (manifestsById)=>({
  'type': 'LOAD_MANIFESTS',
  manifestsById
})

// Retrieve all user-visible manifests and send to store
export const requestManifests = () => {
  return (dispatch) => {
    let localSuccess = ({manifests}) => {
      // Bail out if there are no manifests.
      if (manifests == null) return;

      // transform manifests for store
      const manifestsById = manifests.reduce((acc, manifestJSON) => {
        let manifest = {
          ...manifestJSON,
          // create reference to plots that belong to the manifest
          plotIds: manifestJSON.plots.map(p => p.id)
        };
        delete manifest.plots;
        return {...acc, [manifestJSON.id]: manifest};
      }, {});

      dispatch(loadManifests(manifestsById));

      //load plots to store
      const plots = manifests.reduce((acc, manifestJSON) => {
        return [...acc, ...manifestJSON.plots]
      }, []);
      plots.forEach(plot => dispatch(loadPlot(plot)));
    };

    let localError = (err) => {
      showErrors(err, dispatch);
    };

    return fetchManifests(new Exchange(dispatch, 'request-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};


// Remove a manifest from the store.
const removeManifest = (id)=>({
  'type': 'REMOVE_MANIFEST',
  id
});

// Add a manifest to the store.
const addManifest = (manifest)=>({
  'type': 'ADD_MANIFEST',
  manifest
});

const editManifest = (manifest) =>({
  'type': 'UPDATE_USER_MANIFEST',
  manifest
});

// Manifest ui editing flag.
export const toggleEdit = ()=>({
  'type': 'TOGGLE_IS_EDITING_MANIFEST'
});

export const toggleManifestsFilter = (filter)=>({
  'type': 'TOGGLE_MANIFESTS_FILTER',
  filter
});

export const selectManifest = (id)=>({
  'type': 'SELECT_MANIFEST',
  id
});

// Delete a manifest from the database and the store.
export const deleteManifest = (manifestId)=>{
  return (dispatch)=>{

    let localSuccess = (data)=>{
      dispatch(selectManifest(null));
      dispatch(removeManifest(manifestId));
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

   return destroyManifest(manifestId, new Exchange(dispatch, 'delete-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

// Post to create new manifest and save in the store.
export const saveNewManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(addManifest(response.manifest));
      dispatch(toggleEdit());
      dispatch(selectManifest(response.manifest.id));
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

    let localSuccess = (data)=>{
      dispatch(editManifest(manifest));
      dispatch(toggleEdit());
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return updateManifest(manifest, manifest.id, new Exchange(dispatch, 'save-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

export const copyManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(addManifest(response.manifest));
      dispatch(selectManifest(response.manifest.id));
      dispatch(toggleEdit());
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return createManifest({...manifest, 'name': `${manifest.name}(copy)`}, new Exchange(dispatch, 'copy-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

// Convert a manifest to its JSON representation for query endpoint.
export const manifestToReqPayload = (manifest)=>{
  const {name, 'data': {elements}} = manifest;
  const manifestElements = elements.reduce((acc, {name, script})=>{
    if(name !== '' && script !== ''){
      return [...acc, [name, script]];
    }
    return acc;
  }, []);

  return {'manifest': manifestElements, 'name': name};
};

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
        .then(res => dispatch(showMessages([res])));
    };

    var manifest_names = manifests.map(m=>m.name).join(', ');
    var exchng = new Exchange(dispatch, `consignment list ${manifest_names}`);

    getConsignments(manifests, exchng)
      .then(localSuccess)
      .catch(localError);
  };
};
