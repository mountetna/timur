export const CACHE_SEARCH_PAGE = 'CACHE_SEARCH_PAGE';
export const EMPTY_SEARCH_CACHE = 'EMPTY_SEARCH_PAGE';
export const SET_SEARCH_PAGE = 'SET_SEARCH_PAGE';
export const SET_SEARCH_PAGE_SIZE = 'SET_SEARCH_PAGE_SIZE';
export const SET_SEARCH_ATTRIBUTES = 'SET_SEARCH_ATTRIBUTES';

export const cacheSearchPage = (
  page,
  model_name,
  record_names,
  clear_cache
) => ({
  type: CACHE_SEARCH_PAGE,
  page,
  model_name,
  record_names,
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

export const setSearchAttributes = (attributes) => ({
  type: SET_SEARCH_ATTRIBUTES,
  attributes
});
