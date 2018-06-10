import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'isomorphic-fetch';
import nock from 'nock';
import * as actions from '../../../lib/client/jsx/actions/manifest_actions';
import allManifestsResp, { plot } from '../fixtures/all_manifests_response';
import manifestStore, { manifest } from '../fixtures/manifests_store';
import manifestResp from '../fixtures/manifest_response';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const PROJECT_NAME = 'labors';

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  });

  global.TIMUR_CONFIG = {
    project_name: PROJECT_NAME,
    magma_host: 'https://magma.test',
  };
  global.Routes = {
    manifests_fetch_path: (projectName) => `http://www.fake.com/${projectName}/manifests`,
    manifests_destroy_path: (projectName, manifestId) => `http://www.fake.com/${projectName}/manifests/destroy/${manifestId}`,
    manifests_create_path: (projectName) => `http://www.fake.com/${projectName}/manifests/create`,
    manifests_update_path: (projectName, manifestId)=> `http://www.fake.com/${projectName}/manifests/update/${manifestId}`
  };
  global.fetch = fetch;
  const currentDate = new Date();
  global.Date = jest.fn(() => currentDate);

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, LOAD_MANIFESTS, and ADD_PLOT when fetching user manifests has been done', () => {
    nock('http://www.fake.com')
      .get(`/${PROJECT_NAME}/manifests`)
      .reply(
        200,
        allManifestsResp,
        {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json'
        }
      );

    const expectedActions = [
      {
        exchange:{
          exchange_name:"request-manifest",
          exchange_path:`http://www.fake.com/${PROJECT_NAME}/manifests`,
          start_time: currentDate
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
        manifestsById: manifestStore
      }
    ];

    const store = mockStore({ manifests: manifestStore });

    return store.dispatch(actions.requestManifests()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, SELECT_MANIFEST, and REMOVE_MANIFEST when deleting a user manifest has been done', () => {
    const manifestId = 1;

    nock('http://www.fake.com')
      .delete(`/${PROJECT_NAME}/manifests/destroy/${manifestId}`)
      .reply(
        200,
        {"manifest": { "id": manifestId } },
        {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json'
        }
      );

    const expectedActions = [
      {
        exchange:{
          exchange_name:"delete-manifest",
          exchange_path:`http://www.fake.com/${PROJECT_NAME}/manifests/destroy/${manifestId}`,
          start_time: currentDate
        },
        exchange_name:"delete-manifest",
        type:"ADD_EXCHANGE"
      },
      {
        exchange_name:"delete-manifest",
        type:"REMOVE_EXCHANGE"
      },
      {
        type: 'SELECT_MANIFEST',
        id: null
      },
      {
        type: 'REMOVE_MANIFEST',
        id: manifestId
      }
    ];

    const store = mockStore({});

    return store.dispatch(actions.deleteManifest(manifestId)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, ADD_MANIFEST, and SELECT_MANIFEST when creating a new user manifest has been done', () => {
    nock('http://www.fake.com')
      .post(`/${PROJECT_NAME}/manifests/create`)
      .reply(
        200,
        manifestResp,
        {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json'
        }
      );

    const expectedActions = [
      {
        exchange:{
          exchange_name:"save-new-manifest",
          exchange_path:`http://www.fake.com/${PROJECT_NAME}/manifests/create`,
          start_time: currentDate
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
      },
      {
        type: 'SELECT_MANIFEST',
        id: 12
      }
    ];

    const store = mockStore({});

    return store.dispatch(actions.saveNewManifest(manifest)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, and UPDATE_USER_MANIFEST when updating user manifest has been done', () => {
    nock('http://www.fake.com')
      .post(`/${PROJECT_NAME}/manifests/update/${manifestResp.manifest.id}`)
      .reply(
        200,
        manifestResp,
        {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json'
        }
      )

    const expectedActions = [
      {
        exchange:{
          exchange_name:"save-manifest",
          exchange_path:`http://www.fake.com/${PROJECT_NAME}/manifests/update/${manifestResp.manifest.id}`,
          start_time: currentDate
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

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, ADD_MANIFEST, and SELECT_MANIFEST when copying a user manifest has been done', () => {
    const newManifestId =  manifestResp.manifest.id + 1;

    const copiedManifestResp = {
      ...manifestResp.manifest,
      name: `${manifestResp.manifest.name}(copy)`,
      id: newManifestId
    };

    nock('http://www.fake.com')
      .post(`/${PROJECT_NAME}/manifests/create`)
      .reply(
        200,
        { "manifest": copiedManifestResp },
        {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json'
        }
      );

    const expectedActions = [
      {
        exchange:{
          exchange_name:"copy-manifest",
          exchange_path:`http://www.fake.com/${PROJECT_NAME}/manifests/create`,
          start_time: currentDate
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
      },
      {
        type: 'SELECT_MANIFEST',
        id: newManifestId
      }
    ];

    const store = mockStore({});

    return store.dispatch(actions.copyManifest(manifestResp.manifest)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
