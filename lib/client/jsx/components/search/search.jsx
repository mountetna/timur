import React, {useEffect, useState, useCallback} from 'react';
import {connect} from 'react-redux';

import 'regenerator-runtime/runtime';
import * as _ from 'lodash';

import {css} from '@emotion/core';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';

import {
  selectModelNames,
} from '../../selectors/magma';
import {
  requestTSV,
  requestModels,
  requestDocuments
} from '../../actions/magma_actions';
import {
  selectSearchCache,
  selectSearchAttributeNames,
  selectSearchFilterParams,
  selectSearchFilterString, selectSelectedModel, selectExpandedDisplayAttributeNames
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
import {Loading} from "etna-js/components/Loading";

const spinnerCss = css`
  display: block;
  margin: 2rem auto;
`;

const loadingSpinner =
  <ClimbingBoxLoader
    css={spinnerCss}
    color='green'
    size={20}
    loading={true}
  />


export function Search({
  attribute_names, cache, requestDocuments, setSearchPageSize, cacheSearchPage, setSearchPage,
  selectedModel, requestModels, emptySearchCache, setSearchAttributeNames, filter_string,
  setSelectedModel, display_attributes,
}) {
  const [pageSize, setPageSize] = useState(10);
  const [results, setResults] = useState(0);
  const { current_page, model_name, record_names, } = cache;
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
    const payload = yield requestDocuments({
      model_name: selectedModel,
      record_names: 'all',
      attribute_names: attribute_names,
      filter: filter_string,
      page: page,
      page_size: pageSize,
      collapse_tables: true,
      exchange_name: `request-${selectedModel}`
    });

    if (newSearch) emptySearchCache();

    let model = payload.models[selectedModel];
    if ('count' in model) setResults(model.count);
    if (!newSearch) setSearchPageSize(pageSize);
    cacheSearchPage(
      page,
      selectedModel,
      Object.keys(model.documents),
      attribute_names,
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
          // This will certainly change when it's an array of items
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
        <Loading loading={results === 0 || loading} delay={500} cacheLastView={true}>
          <div className='results'>
            Found {results} records in{' '}
            <span className='model_name'>{model_name}</span>
          </div>
        </Loading>
      </div>
      <div className='body'>
        <Loading loading={!model_name || (loading && loadingSpinner)} delay={500} cacheLastView={true}>
          <div className='documents'>
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
            />
          </div>
        </Loading>
      </div>
    </div>
  );

  function setPage(page, newSearch) {
    // The page model offset + 1
    page++;
    // Need to re-fetch a page if the user has clicked a new set of
    //    attribute names from the TreeView
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
    attribute_names: selectSearchAttributeNames(state),
    selectedModel: selectSelectedModel(state),
    display_attributes: selectExpandedDisplayAttributeNames(state),
    filter_string: selectSearchFilterString(state),
    filter_params: selectSearchFilterParams(state),
    magma_state: state.magma
  }),
  {
    requestModels,
    cacheSearchPage,
    setSearchPage,
    setSearchPageSize,
    setSearchAttributeNames,
    setFilterString,
    emptySearchCache,
    requestDocuments,
    requestTSV,
    setSelectedModel,
  }
)(Search);
