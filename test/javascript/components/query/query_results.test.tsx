import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {defaultContext} from '../../../../lib/client/jsx/contexts/query/query_context';
import {mockStore, querySpecWrapper} from '../../helpers';
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
  let store;
  let graph = new QueryGraph(models);

  it('renders', async () => {
    store = mockStore({
      magma: {models},
      janus: {projects: require('../../fixtures/project_names.json')}
    });

    let mockState = {
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
    };

    const {asFragment} = render(<QueryResults />, {
      wrapper: querySpecWrapper(mockState, store)
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

    let mockState = {
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
        ],
        labor: [
          {
            model_name: 'labor',
            attribute_name: 'contributions',
            display_label: 'labor.contributions'
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
        ],
        labor: [
          {
            modelName: 'labor',
            attributeName: 'contributions',
            operator: '::slice',
            operand: 'Athens,Sparta'
          }
        ]
      }
    };

    const {asFragment} = render(<QueryResults />, {
      wrapper: querySpecWrapper(mockState, store)
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
