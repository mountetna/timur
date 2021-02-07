// Module imports.
import {getOpts, postOpts, deleteOpts, checkStatus} from 'etna-js/utils/fetch';

export const fetchManifests = (exchange)=> exchange.fetch(
  Routes.fetch_manifests_path(CONFIG.project_name), getOpts
).then(checkStatus);

export const createManifest = (manifest, exchange)=> exchange.fetch(
  Routes.create_manifest_path(CONFIG.project_name), postOpts(manifest)
).then(checkStatus);

export const updateManifest = (manifestUpdates, manifest_id, exchange)=> exchange.fetch(
  Routes.update_manifest_path(CONFIG.project_name, manifest_id), postOpts(manifestUpdates)
).then(checkStatus);

export const destroyManifest = (manifest_id, exchange)=> exchange.fetch(
  Routes.destroy_manifest_path(CONFIG.project_name, manifest_id), deleteOpts
).then(checkStatus);

export const getConsignments = (queries, exchange)=> exchange.fetch(
  Routes.consignment_path(CONFIG.project_name), postOpts({queries})
).then(checkStatus);

export const getConsignmentsByManifestId = (manifest_ids, record_name, exchange)=> exchange.fetch(
  Routes.consignment_path(CONFIG.project_name), postOpts({manifest_ids, record_name})
).then(checkStatus);
