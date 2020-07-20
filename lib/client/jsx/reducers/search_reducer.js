import * as _ from 'lodash';

import {
  CACHE_SEARCH_PAGE,
  EMPTY_SEARCH_CACHE,
  SET_SEARCH_PAGE,
  SET_SEARCH_PAGE_SIZE,
  SET_SEARCH_ATTRIBUTE_NAMES,
  ADD_FILTER_PARAM,
  REMOVE_FILTER_PARAM,
  CLEAR_FILTER_PARAMS,
  SET_FILTER_STRING,
  CLEAR_FILTER_STRING
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
  if (!search) search = {pages: {}};
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
    case ADD_FILTER_PARAM:
      // Make sure filter_params sets filter_string to null,
      //  -- user has decided to use basic instead of advanced filtering
      let new_filter_params = search.filter_params ? search.filter_params : [];
      new_filter_params.push(action.filter_param);
      return {
        ...search,
        filter_params: new_filter_params,
        filter_string: null
      };
    case REMOVE_FILTER_PARAM:
      if (!search.filter_params) {
        return {...search};
      }
      let remaining_filter_params = _.filter(search.filter_params, (param) => {
        return !_.isEqual(param, action.filter_param);
      });
      return {
        ...search,
        filter_params: remaining_filter_params
      };
    case CLEAR_FILTER_PARAMS:
      return {
        ...search,
        filter_params: null
      };
    case SET_FILTER_STRING:
      // User is using advanced filtering, so make sure to clear out
      //   any (basic) filter_params
      return {
        ...search,
        filter_string: action.filter_string,
        filter_params: null
      };
    case CLEAR_FILTER_STRING:
      return {
        ...search,
        filter_string: null
      };
    default:
      return search;
  }
};

export default searchReducer;
