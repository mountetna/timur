import monsters from '../fixtures/monsters';
import * as actions from '../../../lib/client/jsx/actions/magma_actions';
import { mockStore, mockDate, mockFetch, stubUrl, cleanStubs } from '../helpers';

describe('async actions', () => {
  afterEach(cleanStubs);

  mockDate();
  mockFetch();

  it('requests documents from the magma /retrieve endpoint', (done) => {
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
      host: CONFIG.magma_host
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
      done();
    });
  });

  it('posts simple update revisions to the magma /update endpoint', (done) => {
    const template = require('../fixtures/template_monster.json');

    let revisions = {
      monster: {
        stats: {
          path: '::temp'
        }
      }
    };

    const expectedBody = {
      revisions: {
        labors: {
          monster: {
            stats: {
              path: '::temp'
            }
          }
        }
      },
      project_name: 'labors'
    }

    stubUrl({
      verb: 'post',
      path: '/update',
      request: expectedBody,
      response: monsters,
      host: CONFIG.magma_host
    });

    const store = mockStore({});

    return store.dispatch(actions.sendRevisions(
      'labors',
      template,
      revisions,
      () => {
        // should call success function in this case
        expect(true).toEqual(true);
        done();
      },
      () => {
        fail('should not have called the error function')
      }
    ));
  });

  it('removes empty strings from FileCollection revisions', () => {
    const template = require('../fixtures/template_monster.json');

    let revisions = {
      monster: {
        certificates: ["", {
          path: '::temp'
        }, ""]
      }
    };

    const expected = {
      revisions: {
        monsters: {
          monster: {
            certificates: [{
              path: '::temp'
            }]
          }
        }
      }
    };

    const results = actions.formatRevisions(
      revisions,
      'monsters',
      template,
      () => {},
      () => {}
    );

    expect(results).toEqual(expected);
  });
});
