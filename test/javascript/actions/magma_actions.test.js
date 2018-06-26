import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'isomorphic-fetch';
import nock from 'nock';

// Fixtures for data mocking.
import {
  document_response,
  revisions,
  revision_response
} from '../fixtures/magma_fixture';

// Actions to test.
import {
  requestDocuments,
  sendRevisions
} from '../../../lib/client/jsx/actions/magma_actions';

/*
 * Pre test setup.
 */

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const PROJECT_NAME = 'labors';
const url = 'http://magma.test';
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
  magma_host: 'http://magma.test',
};

/*
 * Unit tests for magma_actions.js.
 */

describe('async actions', ()=>{
  afterEach(()=>{
    nock.cleanAll();
  });

  let long_str = '';

  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE, ADD_TEMPLATE, and
ADD_TEMPLATE when requesting documents from the Magma /retrieve endpoint.`;

  it(long_str, ()=>{

    stub_url(
      '/retrieve',
      document_response,
      'post'
    );

    let exchange_name = 'magma-test-retrieve';

    let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name,
        exchange: {
          exchange_name,
          exchange_path: `${url}/retrieve`,
          start_time: current_date,
        },
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name
      },
      {
        type: 'ADD_TEMPLATE',
        model_name: 'monster',
        project_name: PROJECT_NAME,
        template: document_response.models.monster.template,
      },
      {
        type: 'ADD_DOCUMENTS',
        model_name: 'monster',
        project_name: PROJECT_NAME,
        documents: document_response.models.monster.documents
      }
    ];

    let request = [
      {
        model_name: 'monster',
        attribute_names: 'all',
        record_names: 'all',
        exchange_name
      },
      PROJECT_NAME
    ];

    const store = mockStore({});
    return store.dispatch(requestDocuments(...request)).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE, ADD_TEMPLATE, 
ADD_TEMPLATE, and DISCARD_REVISION when revising documents from the Magma 
/update endpoint.`;

  it(long_str, ()=>{

    stub_url(
      '/update',
      revision_response,
      'post'
    );

    let exchange_name = 'revisions-monster';

    let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name,
        exchange: {
          exchange_name,
          exchange_path: `${url}/update`,
          start_time: current_date,
        },
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name
      },
      {
        type: 'ADD_TEMPLATE',
        model_name: 'monster',
        project_name: PROJECT_NAME,
        template: revision_response.models.monster.template,
      },
      {
        type: 'ADD_DOCUMENTS',
        model_name: 'monster',
        project_name: PROJECT_NAME,
        documents: revision_response.models.monster.documents
      },
      {
        type: 'DISCARD_REVISION',
        model_name: 'monster',
        project_name: PROJECT_NAME,
        record_name: 'Caledonian Boar'
      }
    ];

    let request = [
      {
        model_name: 'monster',
        revisions: revisions
      },
      PROJECT_NAME
    ];

    const store = mockStore({});
    return store.dispatch(sendRevisions(...request)).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });
});
