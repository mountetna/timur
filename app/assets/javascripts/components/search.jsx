/*
 * The Search view allows us to post queries for a particular table.
 */

import Magma from 'magma'
import { Component } from 'react'
import { requestModels, requestDocuments } from '../actions/magma_actions'
import { requestTSV } from '../actions/timur_actions'
import { selectSearchCache } from '../selectors/search_cache'
import { requestConsignments } from '../actions/consignment_actions'
import { cacheSearchPage, setSearchPageSize, setSearchPage } from '../actions/search_actions'

var COLUMN_FORMAT = /^([\w]+)([=<>~])(.*)$/

// exclude things not shown and tables
const displayedAttributes = (template) =>
  Object.keys(template.attributes).filter(
    (attribute_name) =>
    template.attributes[attribute_name].shown
    && template.attributes[attribute_name].attribute_class != "Magma::TableAttribute"
  )


class SearchTableColumnHeader extends Component {
  constructor(props) {
    super(props)
    this.state = { sizing: false }
  }

  render() {
    var class_set = {
      table_header: true,
      focused_col: this.props.focused
    }
    class_set[ "c" + this.props.column ] = true
    return <div ref='column' className={ classNames(class_set) }
      onMouseDown={
        (e) => {
          e.preventDefault()
          this.setState({
            sizing: true, x: e.nativeEvent.offsetX, 
            width: this.refs.column.offsetWidth 
          })
        }
      }
      onMouseUp={ () => this.setState({sizing: false}) }
      onMouseMove={
        (e) => {
          if (!this.state.sizing) return
          e.preventDefault()
          var size_change = e.nativeEvent.offsetX - this.state.x
          $('.c'+this.props.column).width(this.state.width + size_change)
        }
      }
    
      >
      { this.props.column }
    </div>
  }
}

class SearchTableRow extends Component {
  render() {
    let { attribute_names, document, template, record_name, focusCell, mode } = this.props
    return <div className="table_row">
      {
        attribute_names.map((att_name, i) =>
          <SearchTableCell 
            key={ att_name }
            att_name={ att_name }
            document={ document }
            template={ template }
            record_name={ record_name }
            focusCell={ focusCell }
            mode={ mode }
          />
        )
      }
    </div>
  }
}

class SearchTableCell extends Component {
  render() {
    let { document, template, record_name, att_name, mode, focusCell } = this.props
    let value = document[ att_name ]


    var class_set = {
      table_data: true,
      revised: (mode == 'edit' && value != revised_value),
      focused_row: focusCell( record_name ),
      focused_col: focusCell( null, att_name),
    }
    class_set[ "c" + att_name ] = true
    return <div
      onClick={ () => focusCell( record_name, att_name ) }
      className={ classNames(class_set) }>
      { 
        (template.attributes[att_name].attribute_class != "Magma::TableAttribute") ?
        <AttributeViewer 
          mode={mode}
          template={ template }
          document={ document }
          value={ value }
          attribute={ template.attributes[att_name] }/>
        : null
      }
    </div>
  }
}

class SearchTable extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  focusCell(row, column) {
    if (column == null) return (row == this.state.focus_row)
    if (row == null) return (column == this.state.focus_col)
    this.setState({ focus_row: row, focus_col: column })
  }

  render() {
    let { record_names, documents, template, attribute_names, mode } = this.props

    if (!record_names) return <div className="table"></div>

    return <div className="table">
              <div className="table_row">
              {
                attribute_names.map((att_name,i) =>
                  <SearchTableColumnHeader key={att_name} 
                    column={ att_name }
                    focused={ this.focusCell( null, att_name ) }
                  />
                )
              }
              </div>
              {
                record_names.map((record_name) =>
                  <SearchTableRow 
                    key={ record_name }
                    mode={ mode }
                    attribute_names={ attribute_names }
                    document={ documents[record_name] }
                    template={template}
                    record_name={ record_name }
                    focusCell={ this.focusCell.bind(this) }
                  />
                )
              }
             </div>
  }
}


SearchTable = connect(
  function(state,props) {
    if (!props.model_name) return {}

    let magma = new Magma(state)
    let documents = magma.documents(props.model_name, props.record_names)
    let template = magma.template(props.model_name)
    let attribute_names = displayedAttributes(template)

    return {
      template,
      attribute_names,
      documents
    }
  }
)(SearchTable)

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = { mode: 'search', page_size: 10 }
  }

  getPage(page, newSearch=false) {
    if (!this.pageCached(page) || newSearch) {
      this.props.requestDocuments({
        model_name: this.state.selected_model,
        record_names: "all",
        attribute_names: "all",
        filter: this.state.current_filter,
        page,
        page_size: this.state.page_size,
        collapse_tables: true,
        exchange_name: `request-${this.state.selected_model}`,
        success: this.makePageCache.bind(this, page, newSearch ? this.state.page_size : null)
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
    return <div className="query">
      <span className="label">Show table</span>
      <Selector name="model"
        values={ this.props.model_names }
        onChange={ (model_name) => this.setState({ selected_model: model_name }) }
        showNone="enabled"/>

      <span className="label">Page size</span>
      <Selector 
        values={ [ 10, 25, 50, 200 ] }
        defaultValue={ this.state.page_size }
        onChange={ (page_size) => this.setState({ page_size }) }
        showNone="disabled"/>
      <input type="text" className="filter" 
        placeholder="filter query"
        onChange={ (e) => this.setState({ current_filter: e.target.value }) }/>

      <input type="button" className="button" value="Search" 
        disabled={ !this.state.selected_model }
        onClick={ 
          () => this.getPage(1, true)
        } />
      <input className="button" 
        type="button" 
        value={"\u21af TSV"} 
        disabled={ !this.state.selected_model }
        onClick={ () => this.props.requestTSV(this.state.selected_model, 
          this.state.current_filter) }/>
    </div>
  }

  render() {
    var pages = this.props.model_name ? Math.ceil(this.state.results / this.props.page_size) : null

    return <div id="search">
        { this.state.mode == 'search' ?
          <div className="control">
            {
              this.renderQuery()
            }
            {
              pages != null ? 
                <div className="pages">
                  <div className="results">
                    Found { this.state.results } records in <span className="model_name">{ this.props.model_name }</span>
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
          this.props.model_name ? <div className="documents">
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

Search = connect(
  function(state, props) {
    var magma = new Magma(state)
    var cache = selectSearchCache(state)
    return {
      model_names: magma.model_names(),
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

export default Search
