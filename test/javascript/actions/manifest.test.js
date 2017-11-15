import 'isomorphic-fetch';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import * as actions from '../../../app/assets/javascripts/actions/manifest_actions';
import { plotFromJson } from '../../../app/assets/javascripts/api/plots';
import allManifestsResp, { plot } from '../fixtures/all_manifests_response';
import manifestStore, { manifest } from '../fixtures/manifests_store';
import manifestResp from '../fixtures/manifest_response';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  });

  global.PROJECT_NAME = 'ipi';
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
      .post('/ipi/manifests')
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
          exchange_path:"http://www.fake.com/ipi/manifests",
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
      },
      {
        plot: plotFromJson(plot),
        type:"ADD_PLOT"
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
      .post(`/ipi/manifests/destroy/${manifestId}`)
      .reply(
        200,
        {"success":true},
        {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json'
        }
      );

    const expectedActions = [
      {
        exchange:{
          exchange_name:"delete-manifest",
          exchange_path:`http://www.fake.com/ipi/manifests/destroy/${manifestId}`,
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

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, ADD_MANIFEST, TOGGLE_IS_EDITING_MANIFEST, and SELECT_MANIFEST when creating a new user manifest has been done', () => {
    nock('http://www.fake.com')
      .post('/ipi/manifests/create')
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
          exchange_path:"http://www.fake.com/ipi/manifests/create",
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
        type: "TOGGLE_IS_EDITING_MANIFEST"
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

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, UPDATE_USER_MANIFEST, and TOGGLE_IS_EDITING_MANIFEST when updating user manifest has been done', () => {
    nock('http://www.fake.com')
      .post(`/ipi/manifests/update/${manifestResp.manifest.id}`)
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
          exchange_path:`http://www.fake.com/ipi/manifests/update/${manifestResp.manifest.id}`,
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
      },
      {
        type: "TOGGLE_IS_EDITING_MANIFEST"
      }
    ];

    const store = mockStore({});

    return store.dispatch(actions.saveManifest({ ...manifestResp.manifest })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, ADD_MANIFEST, SELECT_MANIFEST, and TOGGLE_IS_EDITING_MANIFEST when copying a user manifest has been done', () => {
    const newManifestId =  manifestResp.manifest.id + 1;

    const copiedManifestResp = {
      ...manifestResp.manifest,
      name: `${manifestResp.manifest.name}(copy)`,
      id: newManifestId
    };

    nock('http://www.fake.com')
      .post('/ipi/manifests/create')
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
          exchange_path:"http://www.fake.com/ipi/manifests/create",
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
      },
      {
        type: "TOGGLE_IS_EDITING_MANIFEST"
      }
    ];

    const store = mockStore({});

    return store.dispatch(actions.copyManifest(manifestResp.manifest)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('actions', () => {
  it('transforms the serialized manifest form to the manifest form for the query payload', () => {
    const queryPayload = {
      "manifest": [
        [
          "var",
          "123"
        ],
        [
          "var2",
          "'abc'"
        ]
      ],
      "name": 'NEW MANIFEST'
    };

    expect(actions.manifestToReqPayload(manifest)).toEqual(queryPayload);
  });
});