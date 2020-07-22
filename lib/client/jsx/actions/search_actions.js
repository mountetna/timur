export const CACHE_SEARCH_PAGE = 'CACHE_SEARCH_PAGE';
export const EMPTY_SEARCH_CACHE = 'EMPTY_SEARCH_PAGE';
export const SET_SEARCH_PAGE = 'SET_SEARCH_PAGE';
export const SET_SEARCH_PAGE_SIZE = 'SET_SEARCH_PAGE_SIZE';
export const SET_SEARCH_ATTRIBUTE_NAMES = 'SET_SEARCH_ATTRIBUTE_NAMES';
export const ADD_FILTER_PARAM = 'ADD_FILTER_PARAM';
export const REMOVE_FILTER_PARAM = 'REMOVE_FILTER_PARAM';
export const CLEAR_FILTER_PARAMS = 'CLEAR_FILTER_PARAMS';
export const SET_FILTER_STRING = 'SET_FILTER_STRING';
export const CLEAR_FILTER_STRING = 'CLEAR_FILTER_STRING';

export const cacheSearchPage = (
  page,
  model_name,
  record_names,
  attribute_names,
  clear_cache
) => ({
  type: CACHE_SEARCH_PAGE,
  page,
  model_name,
  record_names,
  attribute_names,
  clear_cache
});

export const emptySearchCache = () => ({
  type: EMPTY_SEARCH_CACHE
});

export const setSearchPage = (page) => ({
  type: SET_SEARCH_PAGE,
  page
});

export const setSearchPageSize = (page_size) => ({
  type: SET_SEARCH_PAGE_SIZE,
  page_size
});

export const setSearchAttributeNames = (attribute_names) => ({
  type: SET_SEARCH_ATTRIBUTE_NAMES,
  attribute_names
});

// Filtering is divided into "basic" (Filter Params)
//   and "advanced" (Filter String)
// filter_sets will be an Array of Filter Parameters.
// Each Filter Parameters will be a Hash with three keys
// { attribute, operator, value }
// Value is expected to be the final value passed to Magma --
//    the filter actions / selectors / reducers
//    do no manipulation, i.e. will not convert a passed-in
//    string to valid RegEx string based on the operator.
// Examples of operators / attributes can be found in the
//    wiki: https://github.com/mountetna/timur/wiki/Searching
export const addFilterParam = (filter_param) => ({
  type: ADD_FILTER_PARAM,
  filter_param
});

export const removeFilterParam = (filter_param) => ({
  type: REMOVE_FILTER_PARAM,
  filter_param
});

export const clearFilterParams = () => ({
  type: CLEAR_FILTER_PARAMS
});

export const setFilterString = (filter_string) => ({
  type: SET_FILTER_STRING,
  filter_string
});

export const clearFilterString = () => ({
  type: CLEAR_FILTER_STRING
});
