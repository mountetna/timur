import monsters from '../fixtures/monsters';
import * as actions from '../../../lib/client/jsx/actions/magma_actions';
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

  it('requests documents from the magma /retrieve endpoint', () => {
    let request = {
      model_name: 'monster',
      project_name: 'labors',
      attribute_names: 'all',
      record_names: 'all',
    }
    stubUrl({
      verb: 'post',
      path: '/retrieve',
      request,
      response: monsters,
      host: TIMUR_CONFIG.magma_host
    });

    const expectedActions = [
      {
        exchange: {
          exchange_name: 'magma-test-retrieve',
          exchange_path: 'https://magma.test/retrieve',
          start_time: Date(),
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
