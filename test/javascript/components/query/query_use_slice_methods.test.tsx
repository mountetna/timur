import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';

import {defaultContext} from '../../../../lib/client/jsx/contexts/query/query_context';
import {mockStore, querySpecWrapper} from '../../helpers';
import useSliceMethods from '../../../../lib/client/jsx/components/query/query_use_slice_methods';
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
  },
  demographics: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../../fixtures/template_demographics.json')
  },
  wound: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../../fixtures/template_wound.json')
  },
  aspect: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../../fixtures/template_aspect.json')
  }
};

describe('useSliceMethods', () => {
  let store;
  const graph = new QueryGraph(models);

  it('does not include root model in collections', async () => {
    store = mockStore({
      magma: {models},
      janus: {projects: require('../../fixtures/project_names.json')}
    });

    let mockState = {
      ...defaultContext.state,
      graph,
      rootModel: 'prize',
      rootIdentifier: {
        model_name: 'prize',
        attribute_name: 'name',
        display_label: 'prize.name'
      },
      columns: [
        {
          model_name: 'prize',
          attribute_name: 'name',
          display_label: 'prize.name',
          slices: []
        },
        {
          model_name: 'victim',
          attribute_name: 'name',
          display_label: 'victim.name',
          slices: []
        },
        {
          model_name: 'prize',
          attribute_name: 'value',
          display_label: 'prize.value',
          slices: []
        }
      ]
    };

    const data = {answer: [], format: [], type: 'Mock'};

    const {result} = renderHook(() => useSliceMethods(data, true), {
      wrapper: querySpecWrapper(mockState, store)
    });

    expect(result.current.collectionModelNames).toEqual(['victim']);
  });

  it('includes non-root tables in collections', async () => {
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
        },
        {
          model_name: 'aspect',
          attribute_name: 'name',
          display_label: 'aspect.name',
          slices: []
        }
      ]
    };

    const data = {answer: [], format: [], type: 'Mock'};

    const {result} = renderHook(() => useSliceMethods(data, true), {
      wrapper: querySpecWrapper(mockState, store)
    });

    expect(result.current.collectionModelNames).toEqual(['aspect', 'prize']);
  });

  it('does not include collections if in the full parentage of root', async () => {
    store = mockStore({
      magma: {models},
      janus: {projects: require('../../fixtures/project_names.json')}
    });

    let mockState = {
      ...defaultContext.state,
      graph,
      rootModel: 'wound',
      rootIdentifier: {
        model_name: 'wound',
        attribute_name: 'name',
        display_label: 'wound.name'
      },
      columns: [
        {
          model_name: 'wound',
          attribute_name: 'name',
          display_label: 'wound.name',
          slices: []
        },
        {
          model_name: 'victim',
          attribute_name: 'name',
          display_label: 'victim.name',
          slices: []
        },
        {
          model_name: 'monster',
          attribute_name: 'name',
          display_label: 'monster.name',
          slices: []
        }
      ]
    };

    const data = {answer: [], format: [], type: 'Mock'};

    const {result} = renderHook(() => useSliceMethods(data, true), {
      wrapper: querySpecWrapper(mockState, store)
    });

    expect(result.current.collectionModelNames).toEqual([]);
  });

  it('includes models with matrices even if is root model', async () => {
    store = mockStore({
      magma: {models},
      janus: {projects: require('../../fixtures/project_names.json')}
    });

    let mockState = {
      ...defaultContext.state,
      graph,
      rootModel: 'labor',
      rootIdentifier: {
        model_name: 'labor',
        attribute_name: 'name',
        display_label: 'labor.name'
      },
      columns: [
        {
          model_name: 'labor',
          attribute_name: 'name',
          display_label: 'labor.name',
          slices: []
        },
        {
          model_name: 'labor',
          attribute_name: 'contributions',
          display_label: 'labor.constributions',
          slices: []
        }
      ]
    };

    const data = {answer: [], format: [], type: 'Mock'};

    const {result} = renderHook(() => useSliceMethods(data, true), {
      wrapper: querySpecWrapper(mockState, store)
    });

    expect(result.current.matrixModelNames).toEqual(['labor']);
  });
});
