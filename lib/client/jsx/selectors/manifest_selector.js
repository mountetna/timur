import { createSelector } from 'reselect';

export const getSelectedManifest = (state)=>{
  // Return the selected manifest.
  if(state.manifests && state.manifestsUI.selected > 0){
    return state.manifests[state.manifestsUI.selected];
  }

  // If the selected id is equal to 0 return a new manifest.
  if(state.manifestsUI.selected == 0){
    let date = new Date;
    let user_name = `${state.timur.user.first} ${state.timur.user.last}`
    return {
      id: 0,
      access: 'private',
      name: '',
      description: '',
      project: '',
      script: '',
      created_at: date.toString(),
      updated_at: date.toString(),
      user: user_name,
      is_editable: true
    };
  }

  // Lastly return null for an empty page.
  return null;
};

export const cloneManifest = (props)=>{
  let manifest = { ...props.manifest }

  return manifest;
}

export const getAllManifests = (state)=>{
  if(state.manifests) return Object.values(state.manifests);
  return [];
};

export const isEmptyManifests = createSelector(
  getAllManifests,
  manifests => !manifests[0]
);

export const getEditableManifests = createSelector(
  getAllManifests,
  manifests => manifests.filter(manifest => manifest.is_editable)
);
