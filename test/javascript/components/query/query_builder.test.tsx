import React from 'react';
import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

import {mockStore, querySpecWrapper, stubUrl} from '../../helpers';
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

  it('renders', async () => {
    stubUrl({
      verb: 'post',
      host: 'https://magma.test',
      path: '/query',
      request: (body) => true,
      status: 200,
      response: {answer: ['Greece', 'Italy', 'France']}
    });

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
              clause: {
                attributeName: 'name',
                operator: '::equals',
                operand: 'Athens',
                attributeType: 'identifier',
                modelName: 'prize',
                any: true
              }
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
              clause: {
                attributeName: 'name',
                operator: '::equals',
                operand: 'Sparta',
                attributeType: 'identifier',
                modelName: 'prize',
                any: true
              }
            }
          ]
        },
        {
          model_name: 'victim',
          attribute_name: 'country',
          display_label: 'victim.country',
          slices: [
            {
              modelName: 'victim',
              clause: {
                attributeName: 'country',
                operator: '::equals',
                operand: 'Greece',
                attributeType: 'string',
                modelName: 'victim',
                any: true
              }
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

    await waitFor(() => screen.getByTestId('operand-autocomplete'));

    const autocomplete = screen.getByTestId('operand-autocomplete');
    fireEvent.change(autocomplete.getElementsByTagName('input')[0], {
      target: {value: 'It'}
    });

    await waitFor(() => screen.getByText('Italy'));

    userEvent.click(screen.getByText('Italy'));

    await waitFor(() => screen.getByText(/"Italy"/));

    expect(asFragment()).toMatchSnapshot();
  });
});
