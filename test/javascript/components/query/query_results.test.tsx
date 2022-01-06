import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {mockStore, querySpecWrapper} from '../../helpers';
import QueryResults from '../../../../lib/client/jsx/components/query/query_results';
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

describe('QueryResults', () => {
  let store;
  let graph = new QueryGraph(models);

  it('renders', async () => {
    store = mockStore({
      magma: {models},
      janus: {projects: require('../../fixtures/project_names.json')}
    });

    let mockGraphState = {
      graph,
      rootModel: 'monster'
    };

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
              clause: {
                attributeName: 'name',
                operator: '::equals',
                operand: 'Athens',
                attributeType: 'text',
                modelName: 'prize',
                any: true
              }
            }
          ]
        }
      ]
    };

    let mockWhereState = {
      orRecordFilterIndices: [],
      recordFilters: [
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'year',
              operator: '::equals',
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

    const {asFragment} = render(<QueryResults />, {
      wrapper: querySpecWrapper({
        mockGraphState,
        mockColumnState,
        mockWhereState,
        mockResultsState: defaultQueryResultsParams,
        store
      })
    });

    await waitFor(() => screen.getByText('Nest matrices'));

    expect(asFragment()).toMatchSnapshot();

    expect(screen.getByText('monster.name')).toBeTruthy();
    expect(screen.getByText('prize.name')).toBeTruthy();
  });

  it('expands and nests matrix columns', async () => {
    store = mockStore({
      magma: {models},
      janus: {projects: require('../../fixtures/project_names.json')}
    });

    let mockGraphState = {
      graph,
      rootModel: 'monster'
    };

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
              clause: {
                attributeName: 'name',
                operator: '::equals',
                operand: 'Athens',
                attributeType: 'text',
                modelName: 'prize',
                any: true
              }
            }
          ]
        },
        {
          model_name: 'labor',
          attribute_name: 'contributions',
          display_label: 'labor.contributions',
          slices: [
            {
              modelName: 'labor',
              clause: {
                attributeName: 'contributions',
                operator: '::slice',
                operand: 'Athens,Sparta',
                attributeType: 'matrix',
                modelName: 'labor',
                any: true
              }
            }
          ]
        }
      ]
    };

    let mockWhereState = {
      orRecordFilterIndices: [],
      recordFilters: [
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'year',
              operator: '::equals',
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

    const {asFragment} = render(<QueryResults />, {
      wrapper: querySpecWrapper({
        mockGraphState,
        mockColumnState,
        mockWhereState,
        mockResultsState: defaultQueryResultsParams,
        store
      })
    });

    await waitFor(() => screen.getByText('Nest matrices'));

    expect(asFragment()).toMatchSnapshot();

    expect(screen.getByText('labor.contributions.Athens')).toBeTruthy();
    expect(screen.getByText('labor.contributions.Sparta')).toBeTruthy();

    fireEvent.click(screen.getByText('Nest matrices'));

    expect(screen.getByText('labor.contributions')).toBeTruthy();
    expect(() => screen.getByText('labor.contributions.Athens')).toThrowError();
    expect(() => screen.getByText('labor.contributions.Sparta')).toThrowError();
  });
});
