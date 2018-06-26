import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'isomorphic-fetch';
import nock from 'nock';

// Fixtures for data mocking.
import {
  view_data,
  default_view_data
} from '../fixtures/tab_test_data';

// Actions to test.
import {
  requestView,
  requestViewSettings,
  updateViewSettings,
  deleteViewSettings
} from '../../../lib/client/jsx/actions/timur_actions';

/*
 * Pre test setup.
 */

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const PROJECT_NAME = 'labors';
const url = 'http://timur.test';
const current_date = new Date();

const stub_url = (path, response, verb)=>{
  nock(url)[verb](path)
    .reply(
      200,
      response,
      {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json'
      }
    );
};

global.fetch = fetch;
global.Date = jest.fn(() => current_date);
global.TIMUR_CONFIG = {
  project_name: PROJECT_NAME,
  magma_host: 'http://magma.test'
};

global.Routes = {
  retrieve_view_path: (prj_nm, mdl_nm)=> `${url}/${prj_nm}/view/${mdl_nm}`,
  update_view_path: (prj_nm)=> `${url}/${prj_nm}/view/update`,
  delete_view_path: (prj_nm)=> `${url}/${prj_nm}/view/delete`
};

/*
 * Unit tests for magma_actions.js.
 */

describe('async timur_actions', ()=>{
  afterEach(() => {
    nock.cleanAll()
  });

  let long_str = '';

  // Testing the request of a single view model.
  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE, and ADD_TAB when 
requesting a single model view from the requestView action.`;

  it(long_str, ()=>{
    let model_nm = 'monster';
    let tab_nm = 'default';
    let rec_nm = 'Caledonian Boar';

    stub_url(
      `/${PROJECT_NAME}/view/${model_nm}`,
      view_data,
      'get'
    );

    let exchange_name = `view for ${model_nm} ${rec_nm}`;

    let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name: `view for ${model_nm} ${rec_nm}`,
        exchange: {
          exchange_name: `view for ${model_nm} ${rec_nm}`,
          exchange_path: `${url}/${PROJECT_NAME}/view/${model_nm}`,
          start_time: current_date,
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name: `view for ${model_nm} ${rec_nm}`
      },
      {
        type: 'ADD_EXCHANGE',
        exchange_name: `tab ${tab_nm} for ${model_nm} ${rec_nm}`,
        exchange: {
          exchange_name: `tab ${tab_nm} for ${model_nm} ${rec_nm}`,
          exchange_path: `${TIMUR_CONFIG.magma_host}/retrieve`,
          start_time: current_date,
        }
      },
      {
        type: 'ADD_TAB',
        view_name: model_nm,
        tab_name: 'default',
        tab: view_data.views.monster.tabs.default
      },
      {
        type: 'ADD_TAB',
        view_name: model_nm,
        tab_name: 'other_tab',
        tab: view_data.views.monster.tabs.other_tab
      }
    ];

    let request = [model_nm, rec_nm, tab_nm];

    let store = mockStore({});
    return store.dispatch(requestView(...request)).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  // Testing the request of a single view model that does not exist.
  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE, and ADD_TAB when 
requesting a non existant model view from the requestView action.`;

  it(long_str, ()=>{
    let model_nm = 'farmer';
    let tab_nm = 'default';
    let rec_nm = 'adam';

    stub_url(
      `/${PROJECT_NAME}/view/${model_nm}`,
      default_view_data,
      'get'
    );

    let exchange_name = `view for ${model_nm} ${rec_nm}`;

    let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name: `view for ${model_nm} ${rec_nm}`,
        exchange: {
          exchange_name: `view for ${model_nm} ${rec_nm}`,
          exchange_path: `${url}/${PROJECT_NAME}/view/${model_nm}`,
          start_time: current_date,
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name: `view for ${model_nm} ${rec_nm}`
      }
    ];

    let request = [model_nm, rec_nm, tab_nm];

    let store = mockStore({});
    return store.dispatch(requestView(...request)).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  // Testing the request of ALL view models.
  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE, and ADD_VIEW when 
requesting all view models from the requestViewSettings action.`;

  it(long_str, ()=>{

    stub_url(
      `/${PROJECT_NAME}/view/all`,
      view_data,
      'get'
    );

    let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name: 'view for settings',
        exchange: {
          exchange_name: 'view for settings',
          exchange_path: `${url}/${PROJECT_NAME}/view/all`,
          start_time: current_date,
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name: 'view for settings'
      },
      {
        type: 'ADD_VIEW',
        view_name: 'olympian',
        view: view_data.views.olympian
      },
      {
        type: 'ADD_VIEW',
        view_name: 'monster',
        view: view_data.views.monster
      }
    ];

    let store = mockStore({});
    return store.dispatch(requestViewSettings()).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  // Testing the update of a view model.
  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE, and REFRESH_VIEWS when 
updating a model view from the updateViewSettings action.`;

  it(long_str, ()=>{

    let updated_data = view_data.views.olympian;
    updated_data.tabs['title'] = 'Default Tab';
    updated_data.tabs.panes.default['title'] = 'Default Pane';

    stub_url(
      `/${PROJECT_NAME}/view/update`,
      {views: {olympian: updated_data}},
      'post'
    );

     let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name: 'updating view settings',
        exchange: {
          exchange_name: 'updating view settings',
          exchange_path: `${url}/${PROJECT_NAME}/view/update`,
          start_time: current_date,
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name: 'updating view settings'
      },
      {
        type: 'REFRESH_VIEWS',
        views: {olympian: updated_data}
      }
    ];

    let store = mockStore({});
    return store.dispatch(updateViewSettings(updated_data)).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  // Testing the deletion of a view model.
  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE, and REFRESH_VIEWS when 
deleting a model view from the deleteViewSettings action.`;

  it(long_str, ()=>{

    stub_url(
      `/${PROJECT_NAME}/view/delete`,
      {views: {olympian: view_data.views.olympian}},
      'post'
    );

    let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name: 'delete view settings',
        exchange: {
          exchange_name: 'delete view settings',
          exchange_path: `${url}/${PROJECT_NAME}/view/delete`,
          start_time: current_date,
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name: 'delete view settings'
      },
      {
        type: 'REFRESH_VIEWS',
        views: {olympian: view_data.views.olympian}
      }
    ];

    let store = mockStore({});
    let monster_view = view_data.views.monster;
    return store.dispatch(deleteViewSettings(monster_view)).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });
});
