import * as _ from 'lodash';

import {
  CACHE_SEARCH_PAGE,
  EMPTY_SEARCH_CACHE,
  SET_SEARCH_PAGE,
  SET_SEARCH_PAGE_SIZE,
  SET_SEARCH_ATTRIBUTE_NAMES,
  SET_FILTER_STRING,
  SET_SHOW_DISCONNECTED,
  CLEAR_FILTER_STRING,
  SET_SELECTED_MODEL,
  SET_OUTPUT_PREDICATE,
  CLEAR_OUTPUT_PREDICATE,
  SET_EXPAND_MATRICES,
  SET_TRANSPOSE_TSV
} from '../actions/search_actions';

const pages = (pages, action) => {
  if (!pages) pages = {};
  switch (action.type) {
    case CACHE_SEARCH_PAGE:
      return {
        ...(!action.clear_cache && pages),
        [action.page]: {
          record_names: action.record_names
        }
      };
  }
};

const searchReducer = (search, action) => {
  if (!search) search = {pages: {}, attribute_names: 'all'};
  switch (action.type) {
    case SET_SEARCH_PAGE_SIZE:
      return {
        ...search,
        page_size: action.page_size
      };
    case SET_SEARCH_PAGE:
      return {
        ...search,
        current_page: action.page
      };
    case SET_SELECTED_MODEL:
      return {
        ...search,
        selected_model: action.selected_model,
      };
    case CACHE_SEARCH_PAGE:
      return {
        ...search,
        model_name: action.model_name,
        pages: pages(search.pages, action),
        cached_attribute_names: action.attribute_names
      };
    case EMPTY_SEARCH_CACHE:
      return {
        ...search,
        model_name: null,
        pages: {}
      };
    case SET_SEARCH_ATTRIBUTE_NAMES:
      return {
        ...search,
        attribute_names: action.attribute_names
      };
    case SET_SHOW_DISCONNECTED:
      return {
        ...search,
        show_disconnected: action.show_disconnected
      };
    case SET_FILTER_STRING:
      return {
        ...search,
        filter_string: action.filter_string
      };
    case CLEAR_FILTER_STRING:
      return {
        ...search,
        filter_string: null
      };
    case SET_OUTPUT_PREDICATE:
      return {
        ...search,
        output_predicate: action.output_predicate
      };
    case CLEAR_OUTPUT_PREDICATE:
      return {
        ...search,
        output_predicate: null
      };
    case SET_EXPAND_MATRICES:
      return {
        ...search,
        expand_matrices: action.expand_matrices
      };
    case SET_TRANSPOSE_TSV:
      return {
        ...search,
        transpose_tsv: action.transpose_tsv
      };
    default:
      return search;
  }
};

export default searchReducer;
