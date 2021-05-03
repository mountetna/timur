export const CACHE_SEARCH_PAGE = 'CACHE_SEARCH_PAGE';
export const EMPTY_SEARCH_CACHE = 'EMPTY_SEARCH_PAGE';
export const SET_SEARCH_PAGE = 'SET_SEARCH_PAGE';
export const SET_SEARCH_PAGE_SIZE = 'SET_SEARCH_PAGE_SIZE';
export const SET_SEARCH_ATTRIBUTE_NAMES = 'SET_SEARCH_ATTRIBUTE_NAMES';
export const SET_FILTER_STRING = 'SET_FILTER_STRING';
export const SET_SHOW_DISCONNECTED = 'SET_SHOW_DISCONNECTED';
export const CLEAR_FILTER_STRING = 'CLEAR_FILTER_STRING';
export const SET_SELECTED_MODEL = 'SET_SELECTED_MODEL';
export const SET_OUTPUT_PREDICATE = 'SET_OUTPUT_PREDICATE';
export const CLEAR_OUTPUT_PREDICATE = 'CLEAR_OUTPUT_PREDICATE';
export const SET_EXPAND_MATRICES = 'SET_EXPAND_MATRICES';
export const SET_TRANSPOSE_TSV = 'SET_TRANSPOSE_TSV';

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

export const setSelectedModel = (selected_model) => ({ type: SET_SELECTED_MODEL, selected_model });

export const setFilterString = (filter_string) => ({
  type: SET_FILTER_STRING,
  filter_string
});

export const setShowDisconnected = (show_disconnected) => ({
  type: SET_SHOW_DISCONNECTED,
  show_disconnected
});

export const clearFilterString = () => ({
  type: CLEAR_FILTER_STRING
});

export const setOutputPredicate = (output_predicate) => ({
  type: SET_OUTPUT_PREDICATE,
  output_predicate
});

export const clearOutputPredicate = () => ({
  type: CLEAR_OUTPUT_PREDICATE
});

export const setExpandMatrices = (expand_matrices) => ({
  type: SET_EXPAND_MATRICES,
  expand_matrices
});

export const setTransposeTsv = (transpose_tsv) => ({
  type: SET_TRANSPOSE_TSV,
  transpose_tsv
});