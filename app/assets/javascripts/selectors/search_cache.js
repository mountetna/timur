import { createSelector } from 'reselect';

class SearchCache {
  constructor(search) {
    this.model_name = search.model_name;
    this.cached_pages = new Set(Object.keys(search.pages));
    this.current_page = search.current_page;
    this.record_names = search.current_page && search.pages[search.current_page] ? search.pages[search.current_page].record_names : null;
    this.page_size = search.page_size;
  }

  isCached(page) {
    return this.cached_pages.has(page);
  }
}

const selectSearchData = (state) => state.search;

export const selectSearchCache = createSelector(
  selectSearchData,
  (search) => new SearchCache(search)
);
