import { showMessages } from './message_actions'
import { fetchManifests, destroyManifest, createManifest, updateManifest } from '../api/manifests'

const showErrors = (e, dispatch)=>{
  let localError = (json)=>dispatch(showMessages(json.errors));
  e.response.json()
    .then(localError);
}

// Add retrieved manifests to the store.
const loadManifests = (manifestsById)=>({
  'type': 'LOAD_MANIFESTS',
  manifestsById
});

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

// Retrieve all user-visible manifests and send to store.
export const requestManifests = ()=>{
  return (dispatch)=>{

    let localSuccess = ({manifests})=>{
      const manifestsById = manifests.reduce((acc, manifestJSON)=>{
        return { ...acc, [manifestJSON.id]: manifestJSON };
      }, {});

      dispatch(loadManifests(manifestsById));
    };

    let localError = (e)=>{
      showErrors(e, dispatch);
    };

    fetchManifests()
      .then(localSuccess)
      .catch(localError);
  };
};

// Delete a manifest from the database and the store.
export const deleteManifest = (manifestId)=>{
  return (dispatch)=>{

    let localSuccess = (data)=>{
      dispatch(selectManifest(null));
      dispatch(removeManifest(manifestId));
    };

    let localError = ()=>{
      showErrors(e, dispatch);
    };

    destroyManifest(manifestId)
      .then(localSuccess)
      .catch(localError);
  };
};

// Post to create new manifest and save in the store.
export const saveNewManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (data)=>{
      dispatch(addManifest(manifest));
      dispatch(toggleEdit());
      dispatch(selectManifest(manifest.id));
    };

    let localError = ()=>{
      showErrors(e, dispatch);
    };

    createManifest(manifest)
      .then(localSuccess)
      .then(localError);
  };
};

export const saveManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (data)=>{
      dispatch(editManifest(manifest));
      dispatch(toggleEdit());
      dispatch(submitManifest(manifest));
    };

    let localError = ()=>{
      showErrors(e, dispatch);
    };

    updateManifest(manifest, manifest.id)
      .then(localSuccess)
      .catch(localError);
  };
};

export const copyManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (data)=>{
      dispatch(addManifest(manifest));
      dispatch(selectManifest(manifest.id));
      dispatch(submitManifest(manifest));
      dispatch(toggleEdit());
    };

    let localError = ()=>{
      showErrors(e, dispatch);
    };

    createManifest({...manifest, name: `${manifest.name}(copy)`})
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
