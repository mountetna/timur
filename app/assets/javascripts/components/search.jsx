/*
 * The Search view allows us to post queries for a particular table.
 * 
 */

import AJAX from 'ajax'

import Magma from 'magma'

var COLUMN_FORMAT = /^([\w]+)([=<>~])(.*)$/

class SearchQuestion {
  constructor(template, filter='') {
    this.template = template
    this.terms = filter.split(/\s+/)
  }

  filter( att_name, operator, value ) {
    var att = this.template.attributes[att_name]
    if (!att) return false
    if (att.attribute_class == "Magma::ForeignKeyAttribute")
      switch(operator) {
        case '=':
          return `[ '${att_name}', '::identifier', '::equals', ${value} ]`
        case '~':
          return `[ '${att_name}', '::identifier', '::matches', ${value} ]`
      }
    else
      switch(operator) {
        case '=':
          return `[ '${att_name}', '::equals', ${value} ]`
        case '~':
          return `[ '${att_name}', '::matches', ${value} ]`
        case '<':
          return `[ '${att_name}', '::<', ${value} ]`
        case '>':
          return `[ '${att_name}', '::>', ${value} ]`
      }
    return false
  }


  format(value) {
    return (typeof value === 'string') ? `'${value}'` : value
  }

  query() {
    var filters = []
    var filter
    for (var term of this.terms) {
      if (!term || term.length == 0) continue
      var match = term.match(COLUMN_FORMAT)
      if (match) {
        var [ , att_name, operator, value ] = match
        filter = this.filter(att_name, operator, this.format(value))
        if (filter) filters.push(filter)
      } else {
        var value = this.format(term)
        for (var att_name in this.template.attributes) {
          var att = this.template.attributes[att_name]
          if (att.type != 'String') continue
          filters.push( this.filter(att_name, '~', value) )
        }
      }
    }

    var filter_string = filters.length > 0 ? (filters.join(', ')+',') : ''

    return [
      [ "model_name", `'${this.template.name}'` ],
      [ "record_names", `question(
          [ @model_name, ${filter_string} '::all', '::identifier' ]
        )` 
      ]
    ]
  }
}

var SearchQuery = React.createClass({
  getInitialState: () => ({}),
  render: function() {
    return <div className="query">
      <span className="label">Show table</span>
      <Selector name="model"
        values={ this.props.model_names }
        onChange={ (model_name) => this.setState({ selected_model: model_name }) }
        showNone="enabled"/>

      <input type="text" className="filter" 
        placeholder="filter query"
        onChange={ (e) => this.setState({ current_filter: e.target.value }) }/>

      <input type="button" className="button" value="Search" 
        disabled={ !this.state.selected_model }
        onClick={ 
          () => this.props.postQuery(
            this.state.selected_model,
            this.state.current_filter
          )
        } />
    </div>
  }
})

var SearchTableColumnHeader = React.createClass({
  getInitialState: function() {
    return { sizing: false }
  },
  render: function() {
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
})

var SearchTableRow = React.createClass({
  render: function() {
    var props = this.props
    return <div className="table_row">
      {
        props.attribute_names.map((att_name, i) =>
          <SearchTableCell 
            key={ att_name }
            att_name={ att_name }
            document={ props.document }
            template={ props.template }
            revision={ props.revision }
            record_name={ props.record_name }
            focusCell={ props.focusCell }
            mode={ props.mode }
          />
        )
      }
    </div>
  }
})

var SearchTableCell = React.createClass({
  render: function() {
    var props = this.props
    var document = props.document
    var revision = props.revision
    var template = props.template
    var record_name = props.record_name
    var att_name = props.att_name
    var value = document[ att_name ]
    var revised_value = revision && revision.hasOwnProperty(att_name) ? revision[att_name] : document[att_name]


    var class_set = {
      table_data: true,
      revised: (props.mode == 'edit' && value != revised_value),
      focused_row: props.focusCell( record_name ),
      focused_col: props.focusCell( null, att_name),
    }
    class_set[ "c" + att_name ] = true
    return <div
      onClick={ () => props.focusCell( record_name, att_name ) }
      className={ classNames(class_set) }>
      { 
        (template.attributes[att_name].attribute_class != "Magma::TableAttribute") ?
        <AttributeViewer 
          mode={props.mode}
          template={ template }
          document={ document }
          value={ value }
          revision={ revised_value }
          attribute={ template.attributes[att_name] }/>
        : null
      }
    </div>
  }
})

var SearchTable = React.createClass({
  getInitialState: function() {
    return {}
  },
  focusCell: function(row, column) {
    if (column == null) return (row == this.state.focus_row)
    if (row == null) return (column == this.state.focus_col)
    this.setState({ focus_row: row, focus_col: column })
  },
  render: function() {
    var props = this.props
    var documents = props.documents
    var revisions = props.revisions
    var template = props.template

    if (!documents) return <div className="table"></div>

    var attribute_names = props.attribute_names

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
                props.record_names.map((record_name) =>
                  <SearchTableRow 
                    key={ record_name }
                    mode={ props.mode }
                    attribute_names={ attribute_names }
                    document={ documents[record_name] }
                    template={template}
                    record_name={ record_name }
                    revision={ revisions[record_name] }
                    focusCell={ this.focusCell }
                  />
                )
              }
             </div>
  },
})

SearchTable = connect(
  function(state,props) {

    if (!props.model_name) return {}

    var magma = new Magma(state)
    var documents = magma.documents(props.model_name, props.record_names)
    var revisions = magma.revisions(props.model_name, props.record_names)
    var template = magma.template(props.model_name)
    var attribute_names = Object.keys(template.attributes).filter(
      (att_name) => template.attributes[att_name].shown
    )

    var complete = props.record_names.every((record_name) => 
      documents[record_name] && attribute_names.every((attribute_name) => 
        documents[record_name].hasOwnProperty(attribute_name)
      )
    )

    if (!complete) documents = null

    return {
      documents: documents,
      revisions: revisions,
      template: template,
      attribute_names: attribute_names
    }
  }
)(SearchTable)

var Search = React.createClass({
  getInitialState: function() {
    return { mode: 'search', page_size: 10, current_page: 0 }
  },
  setPage: function(page) {
    this.setState({ current_page: page }, () => this.ensurePageRecords())
  },
  pageRecordNames: function(page) {
    if (!this.props.record_names.length) return []
    return this.props.record_names.slice( this.state.page_size * page, this.state.page_size * (page + 1) )
  },
  ensurePageRecords: function() {
    var page_record_names = this.pageRecordNames(this.state.current_page)
    if (page_record_names && !this.props.hasCompleteRecords(this.props.model_name, page_record_names)) {
      this.props.requestDocuments( this.props.model_name, page_record_names )
    }
  },
  componentDidMount: function() {
    this.props.getModels()
  },
  makeManifest: function(model_name, template, filter) {
    QueryFilter
    return [
      [ "record_names", 
        `question(
          [ @model_name, '::all', '::identifier' ]
        )`
      ]
    ]
  },
  requestTSV: function(model_name, record_names) {
    var request = {
      model_name: model_name,
      record_names: record_names
    }
    AJAX({
      url: Routes.table_tsv_path(),
      method: 'post',
      data: JSON.stringify(request), 
      sendType: 'application/json',
      returnType: 'binary',
      csrf: true,
      success: (result, status, xhr) => {
        var type = xhr.getResponseHeader("content-type")
        var blob = new Blob([result], { type: type } )
        var link = document.createElement('a')
        var data = window.URL.createObjectURL(blob)
        link.href = data
        link.download = `${model_name}.tsv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      error: (xhr, config, error) => {
        this.props.showMessage([
`### Your attempt to create a TSV failed.

${error}`
        ])
      }
    })
  },
  postQuery: function(model_name, filter) {
    // in this case we will simply post a manifest
    // named 'search'
    //
    // within the manifest will be contained
    // model_name and record_names, which we unpack
    // in the future to make the page.
    var question = new SearchQuestion(this.props.templateFor(model_name), filter)

    this.props.query(
      question.query(),
      (response) => this.setState(
        { current_page: 0 },
        () => this.ensurePageRecords()
      )
    )
  },
  header_handler: function(action) {
    switch(action) {
      case 'cancel':
        this.setState({mode: 'search'})
        this.props.discardRevisions(
          this.props.model_name,
          this.pageRecordNames(this.state.current_page, 
                                 this.props.record_names)
        )
        return
      case 'approve':
        var record_names = this.pageRecordNames(
          this.state.current_page, 
          this.props.record_names
        )
        var revisions = this.props.revisionsFor(
          this.props.model_name,
          record_names
        )
        if (Object.keys(revisions).length > 0) {
          this.setState({mode: 'submit'})
          this.props.submitRevisions(
            this.props.model_name,
            revisions, 
            () => this.setState({mode: 'search'}),
            ( messages ) => {
              this.setState({mode: 'edit'})
              this.props.showMessage(messages.errors || ["### An unknown error occurred.\n\nSeek further insight elsewhere."] )
            }
          )
        } else {
          this.setState({mode: 'search'})
          this.props.discardRevisions(
            this.props.model_name,
            record_names
          )
        }
        return
      case 'edit':
        this.setState({mode: 'edit'})
        return
    }
  },
  render: function() {
    var pages = this.props.model_name ? Math.ceil(this.props.record_names.length / this.state.page_size) : null
    var page_record_names = this.pageRecordNames(this.state.current_page, this.props.record_names)


    return <div id="search">
        { this.state.mode == 'search' ?
          <div className="control">
            <SearchQuery postQuery={ this.postQuery }
              model_names={ this.props.model_names }/>
            {
              pages != null ? 
                <div className="pages">
                  <div className="page_size">
                  Page size
                  <Selector 
                    values={ [ 10, 25, 50, 200 ] }
                    defaultValue={ this.state.page_size }
                    onChange={
                      (page_size) =>
                      this.setState(
                        {
                          page_size: page_size,
                          current_page: Math.min(
                            this.state.current_page, 
                            Math.ceil(this.props.record_names.length / page_size)-1
                          )
                        },
                        () => this.ensurePageRecords()
                      )
                    }
                    showNone="disabled"/>
                    <input className="button" type="button" value={"\u21af TSV"}
                      onClick={
                        () => this.requestTSV(
                          this.props.model_name,
                          this.props.record_names
                        )
                      }/>
                  </div>
                  <div className="results">
                    Found { this.props.record_names.length } records in <span className="model_name">{ this.props.model_name }</span>
                  </div>
                <Pager pages={ pages } 
                  current_page={ this.state.current_page }
                  set_page={ this.setPage } >
                </Pager>
                </div>: null
            }
          </div> : null
        }
        {
          this.props.model_name ? <div className="documents">
            <Header 
              mode={ this.state.mode }
              handler={ this.header_handler }
              can_edit={ this.props.can_edit }/>
            <SearchTable 
              mode={ this.state.mode }
              model_name={ this.props.model_name }
              record_names={ page_record_names }
            />
          </div> : null
        }
    </div>
  }
})

Search = connect(
  function(state, props) {
    var magma = new Magma(state)
    var manifest = timurActions.findManifest(state, 'search') || {}
    return {
      record_names: manifest && manifest.record_names ? manifest.record_names.values : [],
      model_names: magma.model_names(),
      model_name: manifest.model_name,
      templateFor: (model_name) => magma.template(model_name),
      hasCompleteRecords: function(model_name, record_names) {
        var documents = magma.documents(model_name,record_names)
        var template = magma.template(model_name)
        return Object.values(documents).every(
          (document) => Object.keys(template.attributes).every(
            (attribute_name) => document.hasOwnProperty(attribute_name)
          )
        )
      }
    }
  },
  function(dispatch,props) {
    return {
      getModels: function() {
        dispatch(magmaActions.requestModels())
      },
      query: function(manifest, success) {
        dispatch(
          timurActions.requestManifests(
            [
              {
                name: "search",
                manifest: manifest
              }
            ],
            success
          )
        )
      },
      showMessage: function(messages) {
        dispatch(messageActions.showMessages(messages))
      },
      submitRevisions: function(model_name,revisions,success,error) {
        dispatch(magmaActions.postRevisions(
          model_name,
          revisions,
          success,
          error
        ))
      },
      discardRevisions: function(model_name,record_names) {
        if (!record_names || !record_names.length) return
        record_names.forEach(function(record_name){
          dispatch(
            magmaActions.discardRevision(
              record_name,
              model_name
            )
          )
        })
      },
      requestDocuments: function(model, record_names, success) {
        dispatch(magmaActions.requestDocuments(model,record_names,"all",success))
      },
    }
  }
)(Search)

module.exports = Search
