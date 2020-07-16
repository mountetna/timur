import Pager from '../pager';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {css} from '@emotion/core';
import GridLoader from 'react-spinners/GridLoader';

import SelectInput from '../inputs/select_input';
import {selectModelNames} from '../../selectors/magma';
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
    let {attribute_names} = this.props;

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

    // @Zach -- This sets the search attribute_names to the default.
    // When we have UI widgets to control this, we
    //   will need to tie the setSearchAttributes() action
    //   into those widgets and remove this.
    // setSearchAttributes() expects 'all' or a list of attribute names.
    this.props.setSearchAttributeNames('all');
  }

  makePageCache = (page, page_size, payload) => {
    let model = payload.models[this.state.selected_model];
    if (model.count) this.setState({results: model.count});
    if (page_size) this.props.setSearchPageSize(page_size);
    this.setState({loading: false});
    this.props.cacheSearchPage(
      page,
      this.state.selected_model,
      Object.keys(model.documents),
      page == 1
    );
  };

  onSelectTableChange = (model_name) => {
    this.setState({selected_model: model_name});
  };

  renderQuery() {
    let {attribute_names} = this.props;
    const buttonDisabled = !this.state.selected_model || this.state.loading;
    const buttonClasses = buttonDisabled ? 'button disabled' : 'button';

    return (
      <div className="query">
        <span className="label">Show table</span>
        <SelectInput
          name="model"
          values={this.props.model_names}
          onChange={this.onSelectTableChange}
          showNone="enabled"
        />

        <span className="label">Page size</span>
        <SelectInput
          values={[10, 25, 50, 200]}
          defaultValue={this.state.page_size}
          onChange={(page_size) => this.setState({page_size})}
          showNone="disabled"
        />
        <input
          type="text"
          className="filter"
          placeholder="Filter query"
          onChange={(e) => this.setState({current_filter: e.target.value})}
        />

        <input
          id="search-pg-search-btn"
          type="button"
          className={buttonClasses}
          value="Search"
          disabled={buttonDisabled}
          onClick={() => this.getPage(0, true)}
        />
        <input
          id="search-pg-tsv-btn"
          className={buttonClasses}
          type="button"
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

  render() {
    let {cache} = this.props;
    let {current_page, page_size, model_name, record_names} = cache;
    let {results, loading} = this.state;
    let pages = model_name ? Math.ceil(results / page_size) : -1;

    return (
      <div id="search">
        <div className="control">
          {this.renderQuery()}
          {results && !loading && (
            <div className="results">
              Found {results} records in{' '}
              <span className="model_name">{model_name}</span>
            </div>
          )}
        </div>
        {model_name && !loading ? (
          <div className="documents">
            <ModelViewer
              model_name={model_name}
              record_names={record_names}
              page={current_page - 1}
              pages={pages}
              page_size={page_size}
              setPage={this.getPage.bind(this)}
            />
          </div>
        ) : (
          <GridLoader
            css={spinnerCss}
            color="green"
            size={20}
            loading={loading}
          />
        )}
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    model_names: selectModelNames(state),
    cache: selectSearchCache(state),
    attribute_names: selectSearchAttributeNames(state)
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
