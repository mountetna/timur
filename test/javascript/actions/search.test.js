import * as actions from '../../../lib/client/jsx/actions/search_actions';
import {
  mockStore,
  mockDate,
  mockFetch,
  setConfig,
  stubUrl,
  cleanStubs
} from '../helpers';

const PROJECT_NAME = 'labors';

describe('cacheSearchPage', () => {
  it('dcaches the given page', () => {
    const store = mockStore({});
    const page = {};
    const model_name = 'monsters';
    const record_names = ['Nemean Lion', 'Lernean Hydra', 'Augean Stables'];
    const clear_cache = false;
    const attribute_names = ['name', 'species'];

    store.dispatch(
      actions.cacheSearchPage(
        page,
        model_name,
        record_names,
        attribute_names,
        clear_cache
      )
    );

    expect(store.getActions()).toEqual([
      {
        page,
        model_name,
        record_names,
        clear_cache,
        attribute_names,
        type: actions.CACHE_SEARCH_PAGE
      }
    ]);
  });
});

describe('emptySearchCache', () => {
  it('clears out the search cache', () => {
    const store = mockStore({});

    store.dispatch(actions.emptySearchCache());

    expect(store.getActions()).toEqual([{type: actions.EMPTY_SEARCH_CACHE}]);
  });
});

describe('setSearchPage', () => {
  it('sets the given page as the search page', () => {
    const store = mockStore({});
    const page = {
      title: 'A test search page',
      documents: [
        {
          name: 'First document?'
        }
      ]
    };

    store.dispatch(actions.setSearchPage(page));

    expect(store.getActions()).toEqual([{page, type: actions.SET_SEARCH_PAGE}]);
  });
});

describe('setSearchPageSize', () => {
  it('sets the search page size to the specified length', () => {
    const store = mockStore({});
    const page_size = 42;

    store.dispatch(actions.setSearchPageSize(page_size));

    expect(store.getActions()).toEqual([
      {page_size, type: actions.SET_SEARCH_PAGE_SIZE}
    ]);
  });
});

describe('setSearchAttributeNames', () => {
  it('sets the attribute names to "all"', () => {
    const store = mockStore({});

    store.dispatch(actions.setSearchAttributeNames('all'));

    expect(store.getActions()).toEqual([
      {attribute_names: 'all', type: actions.SET_SEARCH_ATTRIBUTE_NAMES}
    ]);
  });

  it('sets the attribute_names to a list of attribute names', () => {
    const store = mockStore({});
    const attribute_names = ['stats', 'name', 'avatar'];

    store.dispatch(actions.setSearchAttributeNames(attribute_names));

    expect(store.getActions()).toEqual([
      {attribute_names, type: actions.SET_SEARCH_ATTRIBUTE_NAMES}
    ]);
  });
});

describe('addFilterParam', () => {
  it('dispatches action to add hash filter param', () => {
    const store = mockStore({});
    const filter_param = {
      attribute: 'stats',
      operator: 'contains',
      value: '/[a-z]/'
    };

    store.dispatch(actions.addFilterParam(filter_param));

    expect(store.getActions()).toEqual([
      {filter_param, type: actions.ADD_FILTER_PARAM}
    ]);
  });
});

describe('removeFilterParam', () => {
  it('dispatches action to remove hash filter param', () => {
    const store = mockStore({});
    const filter_param = {
      attribute: 'stats',
      operator: 'contains',
      value: '/[a-z]/'
    };

    store.dispatch(actions.removeFilterParam(filter_param));

    expect(store.getActions()).toEqual([
      {filter_param, type: actions.REMOVE_FILTER_PARAM}
    ]);
  });
});

describe('clearFilterParams', () => {
  it('dispatches action to clear all filter params', () => {
    const store = mockStore({});

    store.dispatch(actions.clearFilterParams());

    expect(store.getActions()).toEqual([{type: actions.CLEAR_FILTER_PARAMS}]);
  });
});

describe('setFilterString', () => {
  it('dispatches action to set an advanced filter string', () => {
    const store = mockStore({});

    store.dispatch(actions.setFilterString('monsters == all'));

    expect(store.getActions()).toEqual([
      {filter_string: 'monsters == all', type: actions.SET_FILTER_STRING}
    ]);
  });
});

describe('clearFilterString', () => {
  it('dispatches action to clear an advanced filter string', () => {
    const store = mockStore({});

    store.dispatch(actions.clearFilterString());

    expect(store.getActions()).toEqual([{type: actions.CLEAR_FILTER_STRING}]);
  });
});
