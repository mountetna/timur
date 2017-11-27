import { createSelector } from 'reselect';

export const getSelectedManifest = (state)=>{
  // Return the selected manifest.
  if(state.manifests && state.manifestsUI.selected > 0){
    return state.manifests[state.manifestsUI.selected];
  }

  // If the selected id is equal to 0 return a new manifest.
  if(state.manifestsUI.selected == 0){
    let date = new Date;
    return {
      id: 0,
      access: 'public',
      name: '',
      description: '',
      project: '',
      data:{
        elements: []
      },
      created_at: date.toString(),
      updated_at: date.toString(),
      user: {
        name: ''
      },
      is_editable: true,
      plots_id: ''
    };
  }

  // Lastly return null for an empty page.
  return null;
};

export const getAllManifests = (state)=>{
  if(state.manifests) return Object.values(state.manifests);
  return [];
};

export const manifestById = (state, id) => getManifests(state)[id];

export const isEmptyManifests = createSelector(
  getAllManifests,
  manifests => !manifests[0]
);

export const getEditableManifests = createSelector(
  getAllManifests,
  manifests => manifests.filter(manifest => manifest.is_editable)
);
