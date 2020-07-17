import {
  CACHE_SEARCH_PAGE,
  EMPTY_SEARCH_CACHE,
  SET_SEARCH_PAGE,
  SET_SEARCH_PAGE_SIZE,
  SET_SEARCH_ATTRIBUTE_NAMES
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
    default:
      return search;
  }
};

export default searchReducer;
