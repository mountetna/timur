import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'isomorphic-fetch';
import nock from 'nock';
import monsters from '../fixtures/monsters';
import * as actions from '../../../lib/client/jsx/actions/magma_actions';

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

  global.fetch = fetch;
  const currentDate = new Date();
  global.Date = jest.fn(() => currentDate);


  it('requests documents from the magma /retrieve endpoint', () => {
    let request = {
      model_name: 'monster',
      project_name: 'labors',
      attribute_names: 'all',
      record_names: 'all',
    }
    nock(TIMUR_CONFIG.magma_host)
      .post('/retrieve', request)
      .reply(
        200,
        monsters,
        {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json'
        }
      );

    const expectedActions = [
      {
        exchange: {
          exchange_name: 'magma-test-retrieve',
          exchange_path: 'https://magma.test/retrieve',
          start_time: currentDate,
        },
        exchange_name: 'magma-test-retrieve',
        type: 'ADD_EXCHANGE',
      },
      {
        exchange_name: 'magma-test-retrieve',
        type: 'REMOVE_EXCHANGE',
      },
      {
        type: 'ADD_TEMPLATE',
        model_name: 'monster',
        template: monsters.models.monster.template,
      },
      {
        model_name: 'monster',
        type: 'ADD_DOCUMENTS',
        documents: monsters.models.monster.documents
      }
    ];

    const store = mockStore({});

    return store.dispatch(actions.requestDocuments(
      {
        ...request,
        exchange_name: 'magma-test-retrieve'
      }
    )).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
