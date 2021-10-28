import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {mockStore, querySpecWrapper} from '../../helpers';
import QueryBuilder from '../../../../lib/client/jsx/components/query/query_builder';
import {QueryGraph} from '../../../../lib/client/jsx/utils/query_graph';
import {defaultQueryResultsParams} from '../../../../lib/client/jsx/contexts/query/query_results_context';

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

    let mockColumnState = {
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
              clauses: [
                {
                  attributeName: 'name',
                  operator: '::equals',
                  operand: 'Athens',
                  attributeType: 'text',
                  modelName: 'prize',
                  any: true
                }
              ]
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
              clauses: [
                {
                  attributeName: 'name',
                  operator: '::equals',
                  operand: 'Sparta',
                  attributeType: 'text',
                  modelName: 'prize',
                  any: true
                }
              ]
            }
          ]
        }
      ]
    };

    let mockGraphState = {
      graph,
      rootModel: 'monster'
    };

    let mockWhereState = {
      orRecordFilterIndices: [],
      recordFilters: [
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'year',
              operator: '::=',
              operand: 2,
              attributeType: 'number',
              modelName: 'labor',
              any: true
            }
          ],
          anyMap: {}
        }
      ]
    };

    const {asFragment} = render(<QueryBuilder />, {
      wrapper: querySpecWrapper({
        mockColumnState,
        mockGraphState,
        mockWhereState,
        mockResultsState: defaultQueryResultsParams,
        store
      })
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
