import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';

import {defaultContext} from '../../../../lib/client/jsx/contexts/query/query_context';
import {mockStore, querySpecWrapper} from '../../helpers';
import useTableEffects from '../../../../lib/client/jsx/components/query/query_use_table_effects';
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

describe('useTableEffects', () => {
  let store;
  const graph = new QueryGraph(models);

  it('returns column labels', async () => {
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
      }
    };

    const data = {answer: [], format: [], type: 'Mock'};

    const {result} = renderHook(() => useTableEffects(data, true), {
      wrapper: querySpecWrapper(mockState, store)
    });

    expect(result.current.columns.map(({label}) => label)).toEqual([
      'monster.name',
      'prize.name'
    ]);
  });

  it('returns expanded matrix column labels and data', async () => {
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
        labor: [
          {
            model_name: 'labor',
            attribute_name: 'contributions',
            display_label: 'labor.contributions'
          }
        ]
      },
      slices: {
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

    const data = {
      answer: [
        ['Nemean Lion', ['Nemean Lion', [1, 2]]],
        ['Lernean Hydra', ['Lernean Hydra', [3, 0]]]
      ],
      format: [
        'labors::monster#name',
        [
          'labors::monster#name',
          ['labors::labor#contributions', ['Athens', 'Sparta']]
        ]
      ],
      type: 'Mock'
    };

    const {result} = renderHook(() => useTableEffects(data, true), {
      wrapper: querySpecWrapper(mockState, store)
    });

    expect(result.current.columns.map(({label}) => label)).toEqual([
      'monster.name',
      'labor.contributions.Athens',
      'labor.contributions.Sparta'
    ]);
    expect(result.current.rows).toEqual([
      ['Nemean Lion', 1, 2],
      ['Lernean Hydra', 3, 0]
    ]);
  });

  it('returns nested matrix column labels and data', async () => {
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
        labor: [
          {
            model_name: 'labor',
            attribute_name: 'contributions',
            display_label: 'labor.contributions'
          }
        ]
      },
      slices: {
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

    const data = {
      answer: [
        ['Nemean Lion', ['Nemean Lion', [1, 2]]],
        ['Lernean Hydra', ['Lernean Hydra', [3, 0]]]
      ],
      format: [
        'labors::monster#name',
        [
          'labors::monster#name',
          ['labors::labor#contributions', ['Athens', 'Sparta']]
        ]
      ],
      type: 'Mock'
    };

    const {result} = renderHook(() => useTableEffects(data, false), {
      wrapper: querySpecWrapper(mockState, store)
    });

    expect(result.current.columns.map(({label}) => label)).toEqual([
      'monster.name',
      'labor.contributions'
    ]);
    expect(result.current.rows).toEqual([
      ['Nemean Lion', [1, 2]],
      ['Lernean Hydra', [3, 0]]
    ]);
  });

  it('returns expanded matrix column labels and data in the slice order', async () => {
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
        labor: [
          {
            model_name: 'labor',
            attribute_name: 'contributions',
            display_label: 'labor.contributions'
          }
        ]
      },
      slices: {
        labor: [
          {
            modelName: 'labor',
            attributeName: 'contributions',
            operator: '::slice',
            operand: 'Sparta,Athens'
          }
        ]
      }
    };

    const data = {
      answer: [
        ['Nemean Lion', ['Nemean Lion', [2, 1]]],
        ['Lernean Hydra', ['Lernean Hydra', [0, 3]]]
      ],
      format: [
        'labors::monster#name',
        [
          'labors::monster#name',
          ['labors::labor#contributions', ['Sparta', 'Athens']]
        ]
      ],
      type: 'Mock'
    };

    const {result} = renderHook(() => useTableEffects(data, true), {
      wrapper: querySpecWrapper(mockState, store)
    });

    expect(result.current.columns.map(({label}) => label)).toEqual([
      'monster.name',
      'labor.contributions.Sparta',
      'labor.contributions.Athens'
    ]);
    expect(result.current.rows).toEqual([
      ['Nemean Lion', 2, 1],
      ['Lernean Hydra', 0, 3]
    ]);
  });
});
