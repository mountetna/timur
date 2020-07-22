import reducer from '../../../lib/client/jsx/reducers/search_reducer';
import {
  CACHE_SEARCH_PAGE,
  EMPTY_SEARCH_CACHE,
  SET_SEARCH_PAGE,
  SET_SEARCH_PAGE_SIZE,
  SET_SEARCH_ATTRIBUTE_NAMES,
  SET_FILTER_STRING,
  CLEAR_FILTER_STRING,
  ADD_FILTER_PARAM,
  REMOVE_FILTER_PARAM,
  CLEAR_FILTER_PARAMS
} from '../../../lib/client/jsx/actions/search_actions';

describe('search reducer', () => {
  it('sets the search page size', () => {
    expect(
      reducer(
        {
          page_size: 5,
          other: 'data'
        },
        {
          type: SET_SEARCH_PAGE_SIZE,
          page_size: 42
        }
      )
    ).toEqual({
      other: 'data',
      page_size: 42
    });
  });

  it('sets the search page results', () => {
    expect(
      reducer(
        {
          current_page: {
            number: 1
          }
        },
        {
          type: SET_SEARCH_PAGE,
          page: {
            number: 42
          }
        }
      )
    ).toEqual({
      current_page: {
        number: 42
      }
    });
  });

  it('sets the search attribute_names', () => {
    expect(
      reducer(
        {
          current_page: {
            number: 1
          }
        },
        {
          type: SET_SEARCH_ATTRIBUTE_NAMES,
          attribute_names: 'all'
        }
      )
    ).toEqual({
      current_page: {
        number: 1
      },
      attribute_names: 'all'
    });
  });

  it('caches the given page if clear_cache flag is false', () => {
    expect(
      reducer(
        {
          model_name: 'Nemean Lion',
          pages: {
            '1': {
              record_names: ['Zeus', 'Hera']
            }
          }
        },
        {
          type: CACHE_SEARCH_PAGE,
          model_name: 'Lernean Hydra',
          page: 2,
          record_names: ['Nemean Lion', 'Aegean Stables'],
          clear_cache: false
        }
      )
    ).toEqual({
      model_name: 'Lernean Hydra',
      pages: {
        '1': {
          record_names: ['Zeus', 'Hera']
        },
        '2': {
          record_names: ['Nemean Lion', 'Aegean Stables']
        }
      }
    });
  });

  it('empties the cache of other pages with CACHE_SEARCH_PAGE action, if clear_cache flag is true', () => {
    expect(
      reducer(
        {
          model_name: 'Nemean Lion',
          pages: {
            '1': {
              record_names: ['Zeus', 'Hera']
            }
          }
        },
        {
          type: CACHE_SEARCH_PAGE,
          model_name: 'Lernean Hydra',
          page: 2,
          record_names: ['Nemean Lion', 'Aegean Stables'],
          clear_cache: true
        }
      )
    ).toEqual({
      model_name: 'Lernean Hydra',
      pages: {
        '2': {
          record_names: ['Nemean Lion', 'Aegean Stables']
        }
      }
    });
  });

  it('empties the search page cache', () => {
    expect(
      reducer(
        {
          model_name: 'Nemean Lion',
          pages: []
        },
        {
          type: EMPTY_SEARCH_CACHE
        }
      )
    ).toEqual({
      model_name: null,
      pages: {}
    });
  });

  it('sets the advanced filter string', () => {
    expect(
      reducer(
        {
          filter_params: [{attribute: 'species', operator: '==', value: 'lion'}]
        },
        {type: SET_FILTER_STRING, filter_string: 'all'}
      )
    ).toEqual({
      filter_string: 'all',
      filter_params: null
    });
  });

  it('clears the advanced filter string', () => {
    expect(
      reducer(
        {filter_string: 'all', other: 'data'},
        {type: CLEAR_FILTER_STRING}
      )
    ).toEqual({
      other: 'data',
      filter_string: null
    });
  });

  it('adds a basic filter param', () => {
    expect(
      reducer(
        {
          filter_string: 'all',
          filter_params: [{attribute: 'species', operator: '==', value: 'lion'}]
        },
        {
          type: ADD_FILTER_PARAM,
          filter_param: {attribute: 'stats', operator: '~', value: 'dexterity'}
        }
      )
    ).toEqual({
      filter_string: null,
      filter_params: [
        {attribute: 'species', operator: '==', value: 'lion'},
        {attribute: 'stats', operator: '~', value: 'dexterity'}
      ]
    });
  });

  it('returns original search object if no existing params, on REMOVE_FILTER_PARAM action', () => {
    expect(
      reducer(
        {filter_string: 'all'},
        {type: REMOVE_FILTER_PARAM, filter_param: 'all'}
      )
    ).toEqual({
      filter_string: 'all'
    });

    expect(
      reducer(
        {other: 'data', filter_params: []},
        {
          type: REMOVE_FILTER_PARAM,
          filter_param: {attribute: 'species', operator: '=', value: 'lion'}
        }
      )
    ).toEqual({
      other: 'data',
      filter_params: []
    });
  });

  it('returns same filter_params list if no match, on REMOVE_FILTER_PARAM', () => {
    expect(
      reducer(
        {
          filter_params: [{attribute: 'species', operator: '=', value: 'lion'}]
        },
        {
          type: REMOVE_FILTER_PARAM,
          filter_param: {attribute: 'species', operator: '~', value: 'hydra'}
        }
      )
    ).toEqual({
      filter_params: [{attribute: 'species', operator: '=', value: 'lion'}]
    });
  });

  it('removes the specified filter param from existing ones', () => {
    expect(
      reducer(
        {
          filter_params: [
            {attribute: 'species', operator: '=', value: 'lion'},
            {attribute: 'species', operator: '~', value: 'hydra'},
            {attribute: 'species', operator: '>', value: 'boar'},
            {attribute: 'species', operator: '<', value: 'hydra'}
          ]
        },
        {
          type: REMOVE_FILTER_PARAM,
          filter_param: {attribute: 'species', operator: '~', value: 'hydra'}
        }
      )
    ).toEqual({
      filter_params: [
        {attribute: 'species', operator: '=', value: 'lion'},
        {attribute: 'species', operator: '>', value: 'boar'},
        {attribute: 'species', operator: '<', value: 'hydra'}
      ]
    });
  });
});
