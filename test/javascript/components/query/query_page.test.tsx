import React from 'react';
import {Provider} from 'react-redux';
import {
  QueryProvider,
  defaultContext
} from '../../../../lib/client/jsx/contexts/query/query_context';
import {StylesProvider} from '@material-ui/styles/';
import renderer from 'react-test-renderer';
import {mockStore, generateClassName} from '../../helpers';
import QueryPage from '../../../../lib/client/jsx/components/query/query_page';

const models = {
  monster: {template: require('../../fixtures/template_monster.json')},
  labor: {template: require('../../fixtures/template_labor.json')},
  project: {template: require('../../fixtures/template_project.json')}
};

describe('QueryPage', () => {
  let store;

  beforeEach(() => {});

  it('renders', () => {
    store = mockStore({
      magma: {models},
      janus: {projects: require('../../fixtures/project_names.json')}
    });

    global.CONFIG = {
      magma_host: 'https://magma.test'
    };

    // Wrap with Provider here so store gets passed down to child components in Context
    const tree = renderer
      .create(
        <Provider store={store}>
          <StylesProvider generateClassName={generateClassName}>
            <QueryProvider
              state={{
                ...defaultContext.state,
                rootModel: 'monster',
                rootIdentifier: {
                  model_name: 'monster',
                  attribute_name: 'name',
                  display_label: 'monster.name'
                },
                recordFilters: [
                  {
                    modelName: 'labors',
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
              <QueryPage />
            </QueryProvider>
          </StylesProvider>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
