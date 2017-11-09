import { createSelector } from 'reselect';

const getSelectedManifestId = state => state.manifestsUI.selected;

const getManifests = state => state.manifests;

export const manifestById = (state, id) => getManifests(state)[id];

export const getSelectedManifest = createSelector(
  [ getManifests, getSelectedManifestId ],
  (manifests, id) => manifests[id]
);

export const getAllManifests = createSelector(
  getManifests,
  manifests => Object.values(manifests)
);

export const isEmptyManifests = createSelector(
  getAllManifests,
  manifests => !manifests[0]
);

export const getEditableManifests = createSelector(
  getAllManifests,
  manifests => manifests.filter(manifest => manifest.is_editable)
);
