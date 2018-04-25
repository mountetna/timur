import Pager from '../pager';
/*
 * TODO! The <Header /> component has been disabled here. The <Header />
 * component is used to render the bulk edit buttons and events. Editing is
 * presently not working on this 'tab'. We either need to fix the editing
 * feature OR remove the editing feature. Presently the code for editing still
 * exists in this component but has been disabled by removing the <Header />
 * component from the render.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import Magma from '../../magma';
import SelectInput from '../inputs/select_input';
import { requestTSV, requestModels, requestDocuments } from '../../actions/magma_actions';
import { selectSearchCache } from '../../selectors/search_cache';
import { cacheSearchPage, setSearchPageSize, setSearchPage } from '../../actions/search_actions';

import SearchQuery from './search_query';
import Header from '../general/header';
import SearchTable from './search_table';
import SearchQuestion from './search_question';

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = { mode: 'search', page_size: 10 }
  }

  getPage(page, newSearch=false) {
    if (!this.pageCached(page) || newSearch) {
      this.props.requestDocuments({
        model_name: this.state.selected_model,
        record_names: 'all',
        attribute_names: 'all',
        filter: this.state.current_filter,
        page,
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
    return this.props.page_cache.isCached(page.toString())
  }

  componentDidMount() {
    this.props.requestModels()
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
        placeholder='filter query'
        onChange={ (e) => this.setState({ current_filter: e.target.value }) }/>

      <input type='button' className='button' value='Search' 
        disabled={ !this.state.selected_model }
        onClick={ 
          () => this.getPage(1, true)
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
    var pages = this.props.model_name ? Math.ceil(this.state.results / this.props.page_size) : null

    return <div id='search'>
        { this.state.mode == 'search' ?
          <div className='control'>
            {
              this.renderQuery()
            }
            {
              pages != null ? 
                <div className='pages'>
                  <div className='results'>
                    Found { this.state.results } records in <span className='model_name'>{ this.props.model_name }</span>
                  </div>
                <Pager pages={ pages } 
                  current_page={ this.props.current_page }
                  set_page={ this.getPage.bind(this) } >
                </Pager>
                </div>: null
            }
          </div> : null
        }
        {
          this.props.model_name ? <div className='documents'>
            <SearchTable 
              mode={ this.state.mode }
              model_name={ this.props.model_name }
              record_names={ this.props.record_names }
            />
          </div> : null
        }
    </div>
  }
}

export default connect(
  function(state, props) {
    var magma = new Magma(state)
    var cache = selectSearchCache(state)
    return {
      model_names: magma.modelNames(),
      page_cache: cache,
      current_page: cache.current_page,
      page_size: cache.page_size,
      model_name: cache.model_name,
      record_names: cache.record_names
    }
  },
  {
    requestModels,
    cacheSearchPage,
    setSearchPage,
    setSearchPageSize,
    requestDocuments,
    requestTSV,
  }
)(Search)
