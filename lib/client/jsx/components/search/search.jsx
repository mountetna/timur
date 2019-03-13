import Pager from '../pager';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import SelectInput from '../inputs/select_input';
import { selectModelNames } from '../../selectors/magma';
import { requestTSV, requestModels, requestDocuments } from '../../actions/magma_actions';
import { selectSearchCache } from '../../selectors/search_cache';
import { cacheSearchPage, setSearchPageSize, setSearchPage, emptySearchCache } from '../../actions/search_actions';

import ModelViewer from '../model_viewer';

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = { page_size: 10 }
  }

  getPage(page, newSearch=false) {
    page = page + 1;
    if (!this.pageCached(page) || newSearch) {
      this.props.requestDocuments({
        model_name: this.state.selected_model,
        record_names: 'all',
        attribute_names: 'all',
        filter: this.state.current_filter,
        page: page,
        page_size: this.state.page_size,
        collapse_tables: true,
        exchange_name: `request-${this.state.selected_model}`,
        success: this.makePageCache.bind(this, page, 
          newSearch ? this.state.page_size : null)
      })
    }
    this.props.setSearchPage(page)
  }

  pageCached(page) {
    let { cache } = this.props;
    return cache.isCached(page.toString())
  }

  componentDidMount() {
    this.props.requestModels()
    this.props.emptySearchCache();
  }

  makePageCache(page, page_size, payload) {
    let model = payload.models[this.state.selected_model]
    if (model.count) this.setState({ results: model.count })
    if (page_size) this.props.setSearchPageSize(page_size)
    this.props.cacheSearchPage(
      page,
      this.state.selected_model,
      Object.keys(model.documents),
      page == 1
    )
  }

  renderQuery() {
    return <div className='query'>
      <span className='label'>Show table</span>
      <SelectInput name='model'
        values={ this.props.model_names }
        onChange={ (model_name) => this.setState({ selected_model: model_name }) }
        showNone='enabled'/>

      <span className='label'>Page size</span>
      <SelectInput 
        values={ [ 10, 25, 50, 200 ] }
        defaultValue={ this.state.page_size }
        onChange={ (page_size) => this.setState({ page_size }) }
        showNone='disabled'/>
      <input type='text' className='filter' 
        placeholder='Filter query'
        onChange={ (e) => this.setState({ current_filter: e.target.value }) }/>

      <input type='button' className='button' value='Search' 
        disabled={ !this.state.selected_model }
        onClick={ 
          () => this.getPage(0, true)
        } />
      <input className='button' 
        type='button' 
        value={'\u21af TSV'} 
        disabled={ !this.state.selected_model }
        onClick={ () => this.props.requestTSV(this.state.selected_model, 
          this.state.current_filter) }/>
    </div>
  }

  render() {
    let { cache } = this.props;
    let { current_page, page_size, model_name, record_names } = cache;
    let { results } = this.state;
    let pages = model_name ? Math.ceil(results / page_size) : -1;

    return <div id='search'>
      <div className='control'>
        {
          this.renderQuery()
        }
        {
          results && <div className='results'>
            Found { results } records in <span className='model_name'>{ model_name }</span>
          </div>
        }
      </div>
      {
        model_name ? <div className='documents'>
          <ModelViewer
            model_name={ model_name }
            record_names={ record_names }
            page={ current_page-1 }
            pages={ pages }
            page_size={ page_size }
            setPage={ this.getPage.bind(this) }
          />
        </div> : null
      }
    </div>
  }
}

export default connect(
  (state, props) => ({
    model_names: selectModelNames(state),
    cache: selectSearchCache(state)
  }),
  {
    requestModels,
    cacheSearchPage,
    setSearchPage,
    setSearchPageSize,
    emptySearchCache,
    requestDocuments,
    requestTSV,
  }
)(Search)
