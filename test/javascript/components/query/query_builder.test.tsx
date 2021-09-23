import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {defaultContext} from '../../../../lib/client/jsx/contexts/query/query_context';
import {mockStore, querySpecWrapper} from '../../helpers';
import QueryBuilder from '../../../../lib/client/jsx/components/query/query_builder';
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

describe('QueryBuilder', () => {
  let store;
  let graph = new QueryGraph(models);

  it('renders', () => {
    store = mockStore({
      magma: {models},
      janus: {projects: require('../../fixtures/project_names.json')}
    });

    let mockState = {
      ...defaultContext.state,
      graph,
      rootModel: 'monster',
      columns: [
        {
          model_name: 'monster',
          attribute_name: 'name',
          display_label: 'monster.name',
          slices: []
        },
        {
          model_name: 'prize',
          attribute_name: 'name',
          display_label: 'prize.name',
          slices: [
            {
              modelName: 'prize',
              attributeName: 'name',
              operator: '::equals',
              operand: 'Athens'
            }
          ]
        },
        {
          model_name: 'prize',
          attribute_name: 'name',
          display_label: 'prize.name',
          slices: [
            {
              modelName: 'prize',
              attributeName: 'name',
              operator: '::equals',
              operand: 'Sparta'
            }
          ]
        }
      ],
      recordFilters: [
        {
          modelName: 'labor',
          attributeName: 'year',
          operator: '::=',
          operand: 2
        }
      ]
    };

    const {asFragment} = render(<QueryBuilder />, {
      wrapper: querySpecWrapper(mockState, store)
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
