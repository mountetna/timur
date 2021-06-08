import { createSelector } from 'reselect';

export const cloneManifest = (props)=>{
  let manifest = { ...props.manifest };

  return manifest;
};

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
