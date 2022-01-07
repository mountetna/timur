import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';

import {mockStore, querySpecWrapper} from '../../helpers';
import useTableEffects from '../../../../lib/client/jsx/components/query/query_use_table_effects';
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

describe('useTableEffects', () => {
  let store;
  const graph = new QueryGraph(models);

  let mockGraphState = {
    graph,
    rootModel: 'monster'
  };

  let mockWhereState = {
    recordFilters: [],
    orRecordFilterIndices: []
  };

  it('returns column labels', async () => {
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
          slices: []
        }
      ]
    };

    const data = {answer: [], format: [], type: 'Mock'};

    const {result} = renderHook(
      () =>
        useTableEffects({
          data,
          expandMatrices: true,
          columns: mockColumnState.columns,
          graph,
          maxColumns: 10
        }),
      {
        wrapper: querySpecWrapper({
          mockGraphState,
          mockWhereState,
          mockColumnState,
          mockResultsState: defaultQueryResultsParams,
          store
        })
      }
    );

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

    let mockColumnState = {
      columns: [
        {
          model_name: 'monster',
          attribute_name: 'name',
          display_label: 'monster.name',
          slices: []
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

    const data = {
      answer: [
        ['Nemean Lion', [[1, 2]]],
        ['Lernean Hydra', [[3, 0]]]
      ],
      format: [
        'labors::monster#name',
        [['labors::labor#contributions', ['Athens', 'Sparta']]]
      ],
      type: 'Mock'
    };

    const {result} = renderHook(
      () =>
        useTableEffects({
          data,
          expandMatrices: true,
          columns: mockColumnState.columns,
          graph,
          maxColumns: 10
        }),
      {
        wrapper: querySpecWrapper({
          mockGraphState,
          mockWhereState,
          mockColumnState,
          mockResultsState: defaultQueryResultsParams,
          store
        })
      }
    );

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

    let mockColumnState = {
      columns: [
        {
          model_name: 'monster',
          attribute_name: 'name',
          display_label: 'monster.name',
          slices: []
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

    const data = {
      answer: [
        ['Nemean Lion', [[1, 2]]],
        ['Lernean Hydra', [[3, 0]]]
      ],
      format: [
        'labors::monster#name',
        [['labors::labor#contributions', ['Athens', 'Sparta']]]
      ],
      type: 'Mock'
    };

    const {result} = renderHook(
      () =>
        useTableEffects({
          data,
          expandMatrices: false,
          columns: mockColumnState.columns,
          graph,
          maxColumns: 10
        }),
      {
        wrapper: querySpecWrapper({
          mockGraphState,
          mockWhereState,
          mockColumnState,
          mockResultsState: defaultQueryResultsParams,
          store
        })
      }
    );

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

    let mockColumnState = {
      columns: [
        {
          model_name: 'monster',
          attribute_name: 'name',
          display_label: 'monster.name',
          slices: []
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
                operand: 'Sparta,Athens',
                attributeType: 'matrix',
                modelName: 'labor',
                any: true
              }
            }
          ]
        }
      ]
    };

    const data = {
      answer: [
        ['Nemean Lion', [[2, 1]]],
        ['Lernean Hydra', [[0, 3]]]
      ],
      format: [
        'labors::monster#name',
        [['labors::labor#contributions', ['Sparta', 'Athens']]]
      ],
      type: 'Mock'
    };

    const {result} = renderHook(
      () =>
        useTableEffects({
          data,
          expandMatrices: true,
          columns: mockColumnState.columns,
          graph,
          maxColumns: 10
        }),
      {
        wrapper: querySpecWrapper({
          mockGraphState,
          mockWhereState,
          mockColumnState,
          mockResultsState: defaultQueryResultsParams,
          store
        })
      }
    );

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

  it('returns correct data for duplicated columns with distinct slices', async () => {
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
          attribute_name: 'value',
          display_label: 'prize.value',
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
          model_name: 'prize',
          attribute_name: 'value',
          display_label: 'prize.value',
          slices: [
            {
              modelName: 'prize',
              clause: {
                attributeName: 'name',
                operator: '::equals',
                operand: 'Sparta',
                attributeType: 'text',
                modelName: 'prize',
                any: true
              }
            }
          ]
        }
      ]
    };

    const data = {
      answer: [
        ['Nemean Lion', [2, 1]],
        ['Lernean Hydra', [0, 3]]
      ],
      format: [
        'labors::monster#name',
        ['labors::prize#value', 'labors::prize#value']
      ],
      type: 'Mock'
    };

    const {result} = renderHook(
      () =>
        useTableEffects({
          data,
          expandMatrices: true,
          columns: mockColumnState.columns,
          graph,
          maxColumns: 10
        }),
      {
        wrapper: querySpecWrapper({
          mockGraphState,
          mockWhereState,
          mockColumnState,
          mockResultsState: defaultQueryResultsParams,
          store
        })
      }
    );

    expect(result.current.columns.map(({label}) => label)).toEqual([
      'monster.name',
      'prize.value',
      'prize.value'
    ]);
    expect(result.current.rows).toEqual([
      ['Nemean Lion', 2, 1],
      ['Lernean Hydra', 0, 3]
    ]);
  });
});
