import {createSelector} from 'reselect';
import {displayAttributes, selectTemplate} from "./magma";

class SearchCache {
  constructor(search) {
    this.model_name = search.model_name;
    this.cached_pages = new Set(Object.keys(search.pages));
    this.current_page = search.current_page;
    this.record_names =
      search.current_page && search.pages[search.current_page]
        ? search.pages[search.current_page].record_names
        : null;
    this.page_size = search.page_size;
    this.cached_attribute_names = search.cached_attribute_names;
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

export const selectSearchAttributeNames = createSelector(
  selectSearchData,
  (search) => search.attribute_names
);

export const selectSelectedModel = createSelector(
  selectSearchData,
  ({ selected_model }) => selected_model,
)

export const selectExpandedDisplayAttributeNames = createSelector(
  selectSelectedModel,
  ({ magma }) => magma,
  (selectedModel, magma) => {
    if (!selectedModel) return [];

    // Have to use the selector here instead of in connect()
    //   because the selectedModel is in component state instead
    //   of global state.
    const template = selectTemplate({ magma }, selectedModel);
    return displayAttributes(template);
  }
)

export const selectSearchFilterString = createSelector(
  selectSearchData,
  (search) => search.filter_string
);

export const selectSearchFilterParams = createSelector(
  selectSearchData,
  (search) => search.filter_params
);
