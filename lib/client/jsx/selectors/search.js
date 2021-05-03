import {createSelector} from 'reselect';
import {displayAttributes, selectTemplate} from 'etna-js/selectors/magma';
import {sortAttributes} from '../utils/attributes';

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
  ({selected_model}) => selected_model
);

export const selectExpandedDisplayAttributeNames = createSelector(
  selectSelectedModel,
  ({magma}) => magma,
  (selectedModel, magma) => {
    if (!selectedModel) return [];

    // Have to use the selector here instead of in connect()
    //   because the selectedModel is in component state instead
    //   of global state.
    const template = selectTemplate({magma}, selectedModel);
    return displayAttributes(template);
  }
);

export const selectDisplayAttributeNamesAndTypes = createSelector(
  selectExpandedDisplayAttributeNames,
  selectSelectedModel,
  ({magma}) => magma,
  (displayAttributes, selectedModel, magma) => {
    if (!selectedModel) return [];
    const template = selectTemplate({magma}, selectedModel);
    return displayAttributes.map((name) => [
      name,
      template.attributes[name].attribute_type
    ]);
  }
);

export const selectSortedDisplayAttributeNames = createSelector(
  selectExpandedDisplayAttributeNames,
  selectSelectedModel,
  ({magma}) => magma,
  (displayAttributes, selectedModel, magma) => {
    if (!selectedModel) return [];
    const template = selectTemplate({magma}, selectedModel);

    let attributes = {};
    displayAttributes.forEach((name) => {
      attributes[name] = template.attributes[name];
    });
    attributes = Object.values(sortAttributes({...attributes}, true));

    return attributes.map((attribute) => attribute.attribute_name);
  }
);

export const selectSortedAttributeNames = createSelector(
  selectSearchAttributeNames,
  selectSortedDisplayAttributeNames,
  (attributeNames, sortedDisplayNames) => {
    if (attributeNames === 'all') return sortedDisplayNames;
    return attributeNames; // This ordering will be consistent with sortedDisplayNames
  }
);

export const selectSearchFilterString = createSelector(
  selectSearchData,
  (search) => search.filter_string
);

export const selectSearchShowDisconnected = createSelector(
  selectSearchData,
  (search) => search.show_disconnected
);

export const selectSearchOutputPredicate = createSelector(
  selectSearchData,
  (search) => search.output_predicate
);

export const selectSearchUnmeltMatrices = createSelector(
  selectSearchData,
  (search) => search.unmelt_matrices
);
