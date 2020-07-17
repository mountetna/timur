import Pager from '../pager';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as _ from 'lodash';

import {css} from '@emotion/core';
import GridLoader from 'react-spinners/GridLoader';

import SelectInput from '../inputs/select_input';
import {
  selectModelNames,
  selectTemplate,
  displayAttributes
} from '../../selectors/magma';
import {
  requestTSV,
  requestModels,
  requestDocuments
} from '../../actions/magma_actions';
import {
  selectSearchCache,
  selectSearchAttributeNames
} from '../../selectors/search_cache';
import {
  cacheSearchPage,
  setSearchPageSize,
  setSearchPage,
  emptySearchCache,
  setSearchAttributeNames
} from '../../actions/search_actions';

import ModelViewer from '../model_viewer';
import TreeView, {getSelectedLeaves} from 'etna-js/components/TreeView';

const attributeOptions = [
  [
    'Top Level 1',
    [
      ['Inner 1'],
      ['Inner 2', [['Inner Inner 1'], ['Inner Inner 2'], ['Inner Inner 3']]],
      ['Inner 3']
    ]
  ],
  ['Top Level 2']
];

const spinnerCss = css`
  display: block;
  margin: 2rem auto;
`;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {page_size: 10, loading: false};
  }

  getPage = (page, newSearch = false) => {
    let {attribute_names, cache} = this.props;
    let {cached_attribute_names} = cache;

    // Need to re-fetch a page if the user has clicked a new set of
    //    attribute names from the TreeView
    newSearch =
      newSearch || !_.isEqual(cached_attribute_names, attribute_names);

    page = page + 1;

    if (!this.pageCached(page) || newSearch) {
      this.setState({loading: true});
      this.props
        .requestDocuments({
          model_name: this.state.selected_model,
          record_names: 'all',
          attribute_names: attribute_names,
          filter: this.state.current_filter,
          page: page,
          page_size: this.state.page_size,
          collapse_tables: true,
          exchange_name: `request-${this.state.selected_model}`
        })
        .then((response) => {
          // Should clear the cache, especially if the attribute_names changed
          if (newSearch) this.props.emptySearchCache();
          this.handleRequestDocumentsSuccess(page, newSearch, response);
        })
        .catch(this.handleRequestDocumentsError);
    }
    this.props.setSearchPage(page);
  };

  handleRequestDocumentsSuccess = (page, newSearch, response) => {
    this.makePageCache(page, newSearch ? this.state.page_size : null, response);
  };

  handleRequestDocumentsError = (e) => {
    this.setState({loading: false});
  };

  pageCached(page) {
    let {cache} = this.props;
    return cache.isCached(page.toString());
  }

  componentDidMount() {
    this.props.requestModels();
    this.props.emptySearchCache();
    this.props.setSearchAttributeNames('all');
  }

  makePageCache = (page, page_size, payload) => {
    let {attribute_names} = this.props;
    let model = payload.models[this.state.selected_model];
    if (model.count) this.setState({results: model.count});
    if (page_size) this.props.setSearchPageSize(page_size);
    this.setState({loading: false});
    this.props.cacheSearchPage(
      page,
      this.state.selected_model,
      Object.keys(model.documents),
      attribute_names,
      page == 1 // clears the cache if you return to page 1
    );
  };

  onSelectTableChange = (model_name) => {
    this.props.setSearchAttributeNames('all');
    this.setState({selected_model: model_name});
  };

  handleTreeViewSelectionsChange = (new_state) => {
    this.props.setSearchAttributeNames(
      this.convertTreeStateToAttributeNameList(new_state)
    );
  };

  renderQuery() {
    let {attribute_names} = this.props;
    const buttonDisabled = !this.state.selected_model || this.state.loading;
    const buttonClasses = buttonDisabled ? 'button disabled' : 'button';

    return (
      <div className='query'>
        <span className='label'>Show table</span>
        <SelectInput
          name='model'
          values={this.props.model_names}
          onChange={this.onSelectTableChange}
          showNone='enabled'
        />

        <span className='label'>Page size</span>
        <SelectInput
          values={[10, 25, 50, 200]}
          defaultValue={this.state.page_size}
          onChange={(page_size) => this.setState({page_size})}
          showNone='disabled'
        />
        <input
          type='text'
          className='filter'
          placeholder='Filter query'
          onChange={(e) => this.setState({current_filter: e.target.value})}
        />

        <input
          id='search-pg-search-btn'
          type='button'
          className={buttonClasses}
          value='Search'
          disabled={buttonDisabled}
          onClick={() => this.getPage(0, true)}
        />
        <input
          id='search-pg-tsv-btn'
          className={buttonClasses}
          type='button'
          value={'\u21af TSV'}
          disabled={buttonDisabled}
          onClick={() =>
            this.props.requestTSV(
              this.state.selected_model,
              this.state.current_filter,
              attribute_names
            )
          }
        />
      </div>
    );
  }

  convertAttributeNameListToTreeState = (attribute_names) => {
    return attribute_names.reduce((result, attribute_name, index, array) => {
      result[attribute_name] = true;
      return result;
    }, {});
  };

  convertTreeStateToAttributeNameList = (tree_state) => {
    return _.filter(Object.keys(tree_state), (key) => tree_state[key]);
  };

  render() {
    let {cache, magma_state, attribute_names} = this.props;
    let {
      current_page,
      page_size,
      model_name,
      record_names,
      cached_attribute_names
    } = cache;
    let {results, selected_model, loading} = this.state;
    let pages = model_name ? Math.ceil(results / page_size) : -1;
    const _this = this; // for use in ModelBody

    // Have to use the selector here instead of in connect()
    //   because the selected_model is in component state instead
    //   of global state.
    const template = selectTemplate({magma: magma_state}, selected_model);
    let display_attribute_options = displayAttributes(template);

    // display_attribute_options is currently just a flat list of strings
    // To support nesting, we need to re-format it into a list of 1-item lists.
    // Also, we need to
    if (display_attribute_options) {
      // We should attempt to re-order the ModelViewer's cached_attribute_names
      //    in the same order as the template's display_attribute_options.
      // This may change in the future once we finalize what a global
      //    attribute ordering should be.
      cached_attribute_names = cached_attribute_names
        ? display_attribute_options.filter(
            (opt) =>
              cached_attribute_names.includes(opt) ||
              cached_attribute_names === 'all'
          )
        : null;
      display_attribute_options = display_attribute_options.map((opt) => [opt]);
    }

    // Initialize the TreeView state, if not "all"
    const selected_options =
      attribute_names && attribute_names !== 'all'
        ? this.convertAttributeNameListToTreeState(attribute_names)
        : null;

    return (
      <div id='search'>
        <div className='control'>
          {this.renderQuery()}
          {results && (
            <div className='results'>
              Found {results} records in{' '}
              <span className='model_name'>{model_name}</span>
            </div>
          )}
        </div>
        <ModelBody />
      </div>
    );

    function ModelBody() {
      return (
        <div className='body'>
          {selected_model && (
            <div className='attributes'>
              <h3>{selected_model} attributes</h3>
              <TreeView
                selected={selected_options}
                options={display_attribute_options}
                onSelectionsChange={_this.handleTreeViewSelectionsChange}
              />
            </div>
          )}
          {model_name && !loading ? (
            <div className='documents'>
              <ModelViewer
                model_name={model_name}
                record_names={record_names}
                page={current_page - 1}
                pages={pages}
                page_size={page_size}
                setPage={_this.getPage}
                restricted_attribute_names={
                  cached_attribute_names !== 'all'
                    ? cached_attribute_names
                    : null
                }
              />
            </div>
          ) : (
            <GridLoader
              css={spinnerCss}
              color='green'
              size={20}
              loading={loading}
            />
          )}
        </div>
      );
    }
  }
}

export default connect(
  (state, props) => ({
    model_names: selectModelNames(state),
    cache: selectSearchCache(state),
    attribute_names: selectSearchAttributeNames(state),
    magma_state: state.magma
  }),
  {
    requestModels,
    cacheSearchPage,
    setSearchPage,
    setSearchPageSize,
    setSearchAttributeNames,
    emptySearchCache,
    requestDocuments,
    requestTSV
  }
)(Search);
