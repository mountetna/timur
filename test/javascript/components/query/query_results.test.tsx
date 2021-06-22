import React from 'react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
  QueryProvider,
  defaultContext
} from '../../../../lib/client/jsx/contexts/query/query_context';
import {mockStore, generateClassName} from '../../helpers';
import QueryResults from '../../../../lib/client/jsx/components/query/query_results';
import {QueryGraph} from '../../../../lib/client/jsx/utils/query_graph';

const models = {
  monster: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../../fixtures/template_monster.json')
  },
  prize: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../../fixtures/template_prize.json')
  },
  victim: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../../fixtures/template_victim.json')
  },
  labor: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../../fixtures/template_labor.json')
  },
  project: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../../fixtures/template_project.json')
  }
};

describe('QueryResults', () => {
  const server = setupServer();
  let store;

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('renders', () => {
    store = mockStore({
      magma: {models},
      janus: {projects: require('../../fixtures/project_names.json')}
    });

    global.CONFIG = {
      magma_host: 'https://magma.test'
    };

    let graph = new QueryGraph(models);

    // Wrap with Provider here so store gets passed down to child components in Context
    const tree = renderer
      .create(
        <Provider store={store}>
          <StylesProvider generateClassName={generateClassName}>
            <QueryProvider
              state={{
                ...defaultContext.state,
                graph,
                rootModel: 'monster',
                rootIdentifier: {
                  model_name: 'monster',
                  attribute_name: 'name',
                  display_label: 'monster.name'
                },
                attributes: {
                  prize: [
                    {
                      model_name: 'prize',
                      attribute_name: 'name',
                      display_label: 'prize.name'
                    }
                  ]
                },
                recordFilters: [
                  {
                    modelName: 'labor',
                    attributeName: 'year',
                    operator: '::equals',
                    operand: 2
                  }
                ],
                slices: {
                  prize: [
                    {
                      modelName: 'prize',
                      attributeName: 'name',
                      operator: '::equals',
                      operand: 'Athens'
                    }
                  ]
                }
              }}
            >
              <QueryResults />
            </QueryProvider>
          </StylesProvider>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
