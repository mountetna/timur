import { showMessages } from './message_actions'
import {Exchange} from './exchange_actions';
import {fetchManifests, destroyManifest, createManifest, updateManifest} from '../api/manifests';
import {plotFromJson} from '../api/plots';
import { addPlot } from './plot_actions';

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
        let manifest = { ...manifestJSON }
        delete manifest.plots;
        return { ...acc, [manifestJSON.id]: manifest };
      }, {});

      dispatch(loadManifests(manifestsById));

      // collect all the plots from the manifests
      const plots = manifests.reduce((allPlots, manifestJSON) => {
        const manifestPlots = manifestJSON.plots.map(plotJSON => plotFromJson(plotJSON, manifestJSON.is_editable));
        return [ ...allPlots, ...manifestPlots ];
      }, []);

      // load the plots to the store
      plots.forEach(plot => dispatch(addPlot(plot)));
    };

    let localError = (err) => {
      showErrors(err, dispatch);
    };

    fetchManifests(new Exchange(dispatch, 'request-manifest'))
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

    destroyManifest(manifestId, new Exchange(dispatch, 'delete-manifest'))
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

    createManifest(manifest, new Exchange(dispatch, 'save-new-manifest'))
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

    updateManifest(manifest, manifest.id, new Exchange(dispatch, 'save-manifest'))
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

    createManifest({...manifest, 'name': `${manifest.name}(copy)`}, new Exchange(dispatch, 'copy-manifest'))
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
