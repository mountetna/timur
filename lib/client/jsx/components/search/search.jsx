/*
 * TODO! The <Header /> component has been disabled here. The <Header />
 * component is used to render the bulk edit buttons and events. Editing is
 * presently not working on this 'tab'. We either need to fix the editing
 * feature OR remove the editing feature. Presently the code for editing still
 * exists in this component but has been disabled by removing the <Header />
 * component from the render.
 */

// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import Magma from '../../magma';
import Pager from '../pager';
import SelectInput from '../inputs/select_input';
import SearchQuery from './search_query';
import Header from '../header';
import SearchTable from './search_table';
import SearchQuestion from './search_question';

// Module imports.
import {selectSearchCache} from '../../selectors/search_cache';
import {selectModelNames} from '../../selectors/magma_selector';
import {
  requestTSV,
  requestModels,
  requestDocuments
} from '../../actions/magma_actions';

import {
  cacheSearchPage,
  setSearchPageSize,
  setSearchPage
} from '../../actions/search_actions';

class Search extends React.Component{
  constructor(props){
    super(props);
    this.state = {mode: 'search', page_size: 10};
  }

  getPage(page, newSearch=false){
    if (!this.pageCached(page) || newSearch){

      // Remove the appended project name.
      let mdl_nm = this.state.selected_model.split('_');
      let prjt_nm = mdl_nm.shift();
      mdl_nm = mdl_nm.join('_');
      if(mdl_nm == '') mdl_nm = this.state.selected_model;

      this.props.requestDocuments({
        model_name: mdl_nm,
        record_names: 'all',
        attribute_names: 'all',
        filter: this.state.current_filter,
        page,
        page_size: this.state.page_size,
        collapse_tables: true,
        exchange_name: `request-${this.state.selected_model}`,
        success: this.makePageCache.bind(
          this,
          page,
          newSearch ? this.state.page_size : null
        )
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

  renderQuery(){
    let model_select_props = {
      name: 'model',
      values: this.props.model_names,
      onChange: (model_name)=>{
        this.setState({selected_model: model_name});
      },
      showNone: 'enabled'
    };

    let pager_select_props = {
      values: [10, 25, 50, 200],
      defaultValue: this.state.page_size,
      onChange: (page_size) => this.setState({ page_size }),
      showNone: 'disabled'
    };

    let query_input_props = {
      type: 'text',
      className: 'filter',
      placeholder: 'filter query',
      onChange: (e) => this.setState({ current_filter: e.target.value })
    };

    let query_btn_props = {
      type: 'button',
      className: 'button',
      value: 'Search',
      disabled: !this.state.selected_model,
      onClick: () => this.getPage(1, true)
    };

    let tsv_btn_props = {
      className: 'button',
      type: 'button',
      value: '\u21af TSV',
      disabled: !this.state.selected_model,
      onClick: ()=>{
        this.props.requestTSV(
          this.state.selected_model,
          this.state.current_filter
        ); 
      }
    };

    return(
      <div className='query'>

        <span className='label'>{'Show table'}</span>
        <SelectInput {...model_select_props} />
        <span className='label'>{'Page size'}</span>
        <SelectInput {...pager_select_props} />
        <input {...query_input_props} />
        <input {...query_btn_props} />
        <input {...tsv_btn_props} />
      </div>
    );
  }

  render(){

    let pages = null;
    if(this.props.model_name){
      pages = Math.ceil(this.state.results / this.props.page_size);
    }

    let pager_elem = null;
    if(pages != null){

      let pager_props = {
        pages: pages,
        current_page: this.props.current_page,
        set_page: this.getPage.bind(this)
      };

      pager_elem = (
        <div className='pages'>

          <div className='results'>

            {`Found ${this.state.results} records in `}
            <span className='model_name'>

              {this.props.model_name}
            </span>
          </div>
          <Pager {...pager_props} />
        </div>
      );
    }

    let ctrl_elem = null;
    if(this.state.mode == 'search'){
      ctrl_elem = (
        <div className='control'>

          {this.renderQuery()}
          {pager_elem}
        </div>
      );
    }

    let table_elem = null;
    if(this.props.model_name != undefined && this.props.model_name != null){

      let table_props = {
        mode: this.state.mode,
        model_name: this.props.model_name,
        record_names: this.props.record_names
      };

      table_elem = (
        <div className='documents'>

          <SearchTable {...table_props} />
        </div>
      );
    }

    return(
      <div id='search'>

        {ctrl_elem}
        {table_elem}
      </div>
    );
  }
}

const mapStateToProps = (state, own_props)=>{
  let cache = selectSearchCache(state);

  return {
    model_names: selectModelNames(state),
    page_cache: cache,
    current_page: cache.current_page,
    page_size: cache.page_size,
    model_name: cache.model_name,
    record_names: cache.record_names
  }
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestModels: ()=>{
      dispatch(requestModels());
    },

    cacheSearchPage: (page, model_name, record_names, clear_cache)=>{
      dispatch(cacheSearchPage(page, model_name, record_names, clear_cache));
    },

    setSearchPage: (page)=>{
      dispatch(setSearchPage(page));
    },

    setSearchPageSize: (page_size)=>{
      dispatch(setSearchPageSize(page_size));
    },

    requestDocuments: (args)=>{
      dispatch(requestDocuments(args));
    },

    requestTSV: (model, current_filter)=>{
      dispatch(requestTSV(model, current_filter));
    },
  };
};

export const SearchContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
