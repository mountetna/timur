import reducer from '../../../lib/client/jsx/reducers/search_reducer';
import {
  CACHE_SEARCH_PAGE,
  EMPTY_SEARCH_CACHE,
  SET_SEARCH_PAGE,
  SET_SEARCH_PAGE_SIZE,
  SET_SEARCH_ATTRIBUTE_NAMES,
  SET_FILTER_STRING,
  CLEAR_FILTER_STRING
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
          filter_string: ['something=else']
        },
        {type: SET_FILTER_STRING, filter_string: 'all'}
      )
    ).toEqual({
      filter_string: 'all'
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
});
