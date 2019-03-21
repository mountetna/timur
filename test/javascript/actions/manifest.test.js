import * as actions from '../../../lib/client/jsx/actions/manifest_actions';
import { plot } from '../fixtures/all_manifests_response';
import { manifestStore, manifest } from '../fixtures/manifests_store';
import manifestResp from '../fixtures/manifest_response';
import { mockStore, mockDate, mockFetch, setConfig, stubUrl, cleanStubs } from '../helpers';

const PROJECT_NAME = 'labors';

describe('async actions', () => {
  afterEach(cleanStubs);
  mockDate();
  mockFetch();

  setConfig({
    project_name: PROJECT_NAME,
    magma_host: 'https://magma.test',
  });

  global.Routes = {
    manifests_fetch_path: (projectName) => `http://www.fake.com/${projectName}/manifests`,
    manifests_destroy_path: (projectName, manifestId) => `http://www.fake.com/${projectName}/manifests/destroy/${manifestId}`,
    manifests_create_path: (projectName) => `http://www.fake.com/${projectName}/manifests/create`,
    manifests_update_path: (projectName, manifestId)=> `http://www.fake.com/${projectName}/manifests/update/${manifestId}`
  };


  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, LOAD_MANIFESTS, and ADD_PLOT when fetching user manifests has been done', () => {
    stubUrl({
      verb: 'get',
      path: `/${PROJECT_NAME}/manifests`,
      response: { manifests: manifestStore }
    });

    const expectedActions = [
      {
        exchange:{
          exchange_name:"request-manifest",
          exchange_path:`http://www.fake.com/${PROJECT_NAME}/manifests`,
          start_time: Date()
        },
        exchange_name:"request-manifest",
        type:"ADD_EXCHANGE"
      },
      {
        exchange_name:"request-manifest",
        type:"REMOVE_EXCHANGE"
      },
      {
        type: 'LOAD_MANIFESTS',
        manifests: manifestStore
      }
    ];

    const store = mockStore({ manifests: manifestStore });

    return store.dispatch(actions.requestManifests()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE and REMOVE_MANIFEST when deleting a user manifest has been done', () => {
    const manifest = { id: 1 };

    stubUrl({
      verb: 'delete',
      path: `/${PROJECT_NAME}/manifests/destroy/${manifest.id}`,
      response: { manifest }
    });

    const expectedActions = [
      {
        exchange:{
          exchange_name:"delete-manifest",
          exchange_path:`http://www.fake.com/${PROJECT_NAME}/manifests/destroy/${manifest.id}`,
          start_time: Date()
        },
        exchange_name:"delete-manifest",
        type:"ADD_EXCHANGE"
      },
      {
        exchange_name:"delete-manifest",
        type:"REMOVE_EXCHANGE"
      },
      {
        type: 'REMOVE_MANIFEST',
        id: manifest.id
      }
    ];

    const store = mockStore({});

    return store.dispatch(actions.deleteManifest(manifest)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE and ADD_MANIFEST when creating a new user manifest has been done', () => {
    stubUrl({
      verb: 'post',
      path: `/${PROJECT_NAME}/manifests/create`,
      response: manifestResp
    });

    const expectedActions = [
      {
        exchange:{
          exchange_name:"save-new-manifest",
          exchange_path:`http://www.fake.com/${PROJECT_NAME}/manifests/create`,
          start_time: Date()
        },
        exchange_name:"save-new-manifest",
        type:"ADD_EXCHANGE"
      },
      {
        exchange_name:"save-new-manifest",
        type:"REMOVE_EXCHANGE"
      },
      {
        type:"ADD_MANIFEST",
        ...manifestResp
      }
    ];

    const store = mockStore({});

    return store.dispatch(actions.saveNewManifest(manifest)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, and UPDATE_USER_MANIFEST when updating user manifest has been done', () => {
    stubUrl({
      verb: 'post',
      path: `/${PROJECT_NAME}/manifests/update/${manifestResp.manifest.id}`,
      response: manifestResp
    });

    const expectedActions = [
      {
        exchange:{
          exchange_name:"save-manifest",
          exchange_path:`http://www.fake.com/${PROJECT_NAME}/manifests/update/${manifestResp.manifest.id}`,
          start_time: Date()
        },
        exchange_name:"save-manifest",
        type:"ADD_EXCHANGE"
      },
      {
        exchange_name:"save-manifest",
        type:"REMOVE_EXCHANGE"
      },
      {
        type:"UPDATE_USER_MANIFEST",
        ...manifestResp
      }
    ];

    const store = mockStore({});

    return store.dispatch(actions.saveManifest({ ...manifestResp.manifest })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE and ADD_MANIFEST when copying a user manifest has been done', () => {
    const newManifestId =  manifestResp.manifest.id + 1;

    const copiedManifestResp = {
      ...manifestResp.manifest,
      name: `${manifestResp.manifest.name}(copy)`,
      id: newManifestId
    };

    stubUrl({
      verb: 'post',
      path: `/${PROJECT_NAME}/manifests/create`,
      response: { "manifest": copiedManifestResp }
    });

    const expectedActions = [
      {
        exchange:{
          exchange_name:"copy-manifest",
          exchange_path:`http://www.fake.com/${PROJECT_NAME}/manifests/create`,
          start_time: Date()
        },
        exchange_name:"copy-manifest",
        type:"ADD_EXCHANGE"
      },
      {
        exchange_name:"copy-manifest",
        type:"REMOVE_EXCHANGE"
      },
      {
        type:"ADD_MANIFEST",
        manifest: copiedManifestResp
      }
    ];

    const store = mockStore({});

    return store.dispatch(actions.copyManifest(manifestResp.manifest)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
