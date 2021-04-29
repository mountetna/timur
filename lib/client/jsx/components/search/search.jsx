import React, {useEffect, useState, useCallback} from 'react';
import {connect} from 'react-redux';

import 'regenerator-runtime/runtime';
import * as _ from 'lodash';

import {
  selectModelNames,
} from 'etna-js/selectors/magma';
import {
  requestModels,
} from 'etna-js/actions/magma_actions';
import {
  selectSearchCache,
  selectSearchAttributeNames,
  selectSearchFilterString,
  selectSearchShowDisconnected,
  selectSelectedModel,
  selectSortedAttributeNames,
  selectExpandedDisplayAttributeNames,
  selectSortedDisplayAttributeNames,
  selectSearchOutputPredicate
} from '../../selectors/search';
import {
  cacheSearchPage,
  setSearchPageSize,
  setSearchPage,
  emptySearchCache,
  setSearchAttributeNames,
  setFilterString,
  setSelectedModel,
} from '../../actions/search_actions';

import ModelViewer from '../model_viewer';
import useAsyncWork from "etna-js/hooks/useAsyncWork";
import SearchQuery from "./search_query";
import {showMessages} from "etna-js/actions/message_actions";
import {useRequestDocuments} from "../../hooks/useRequestDocuments";

export function Search({
  queryableAttributes, cache, setSearchPageSize, cacheSearchPage,
  setSearchPage, selectedModel, requestModels, emptySearchCache,
  setSearchAttributeNames, filter_string, show_disconnected,
  setSelectedModel, display_attributes, attributesNamesState, showMessages,
  output_predicate
}) {
  const [pageSize, setPageSize] = useState(10);
  const [results, setResults] = useState(0);
  const [lastLoadedAttributeState, setLastLoadedAttributeState] = useState(attributesNamesState);
  const { current_page, model_name, record_names, } = cache;
  const requestDocuments = useRequestDocuments();
  let { cached_attribute_names } = cache;

  // On mount, essentially.
  useEffect(() => {
    requestModels();
    emptySearchCache();
    setSearchAttributeNames('all');
  }, [])

  const onSelectTableChange = useCallback((model_name) => {
    setSearchAttributeNames('all');
    emptySearchCache();
    setSelectedModel(model_name);
    setResults(0);
  }, [setSearchAttributeNames, emptySearchCache, setSelectedModel]);

  const [loading, loadDocuments] = useAsyncWork(function* loadDocuments(page, newSearch) {
    console.log('output_predicate', output_predicate);
    const payload = yield requestDocuments({
      model_name: selectedModel,
      record_names: 'all',
      attribute_names: queryableAttributes,
      filter: filter_string,
      show_disconnected,
      page: page,
      page_size: pageSize,
      collapse_tables: true,
      exchange_name: `request-${selectedModel}`,
      output_predicate: output_predicate
    });

    if (newSearch) emptySearchCache();
    if (!newSearch) setSearchPageSize(pageSize);

    let model = payload.models[selectedModel];
    if ('count' in model) setResults(model.count);

    setLastLoadedAttributeState(attributesNamesState);
    cacheSearchPage(
      page,
      selectedModel,
      Object.keys(model.documents),
      queryableAttributes,
      page === 1 // clears the cache if you return to page 1
    );
    // Cancel only when multiple consecutive invocations are run.
  }, { cancelWhenChange: [] });

  let pages = model_name ? Math.ceil(results / pageSize) : -1;

  // We should attempt to re-order the ModelViewer's cached_attribute_names
  //    in the same order as the template's display_attribute_options.
  // This will change in the future once we finalize what a global
  //    attribute ordering should be.
  cached_attribute_names = cached_attribute_names
    ? _.flatten(
      display_attributes.filter(
        (opt) =>
          cached_attribute_names.includes(opt) ||
          cached_attribute_names === 'all'
      )
    )
    : null;

  return (
    <div id='search'>
      <div className='control'>
        <SearchQuery loading={loading} onSelectTableChange={onSelectTableChange} pageSize={pageSize}
                     display_attributes={display_attributes}
                     selectedModel={selectedModel} setPage={setPage} setPageSize={setPageSize} />
      </div>
      <div className='body'>
        <ModelViewer
          model_name={model_name}
          record_names={record_names}
          page={current_page - 1}
          pages={pages}
          page_size={pageSize}
          setPage={setPage}
          restricted_attribute_names={
            cached_attribute_names !== 'all'
              ? cached_attribute_names
              : null
          }
        >
          <div className='results'>
            {results} records in {' '}
            <span className='model_name'>{model_name}</span>
          </div>
        </ModelViewer>
      </div>
    </div>
  );

  function setPage(page, newSearch) {
    // The page model offset + 1
    page++;
    // Need to re-fetch a page if the user has clicked a new set of
    //    attribute names from the TreeView
    newSearch = newSearch || attributesNamesState !== lastLoadedAttributeState;
    if (!cache.isCached(page.toString()) || newSearch) {
      loadDocuments(page, newSearch)
    }
    setSearchPage(page)
  }
}

export default connect(
  (state, props) => ({
    model_names: selectModelNames(state),
    cache: selectSearchCache(state),
    queryableAttributes: selectSortedAttributeNames(state),
    attributesNamesState: selectSearchAttributeNames(state),
    selectedModel: selectSelectedModel(state),
    display_attributes: selectSortedDisplayAttributeNames(state),
    filter_string: selectSearchFilterString(state),
    show_disconnected: selectSearchShowDisconnected(state),
    magma_state: state.magma,
    output_predicate: selectSearchOutputPredicate(state)
  }),
  {
    requestModels,
    cacheSearchPage,
    setSearchPage,
    setSearchPageSize,
    setSearchAttributeNames,
    setFilterString,
    emptySearchCache,
    setSelectedModel,
    showMessages,
  }
)(Search);
