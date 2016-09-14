/*
 * The Search view allows us to post queries for a particular table.
 * 
 */


/* This holds the search query so we don't have to update state in the
 * main component all the time.
 */
SearchQuery = React.createClass({
  getInitialState: function() {
    return { }
  },
  requestTSV: function(model_name, filter) {
    var newForm = $('<form>', { method: 'POST', action: Routes.table_tsv_path() })
    newForm.append(
      $('<input>', {
        name: 'model_name',
        value: model_name,
        type: 'hidden'
      })
    )
    newForm.append(
      $('<input>', {
        name: 'filter',
        value: filter,
        type: 'hidden'
      })
    )
    newForm.append(
      $('<input>', {
        name: 'authenticity_token',
        value: $('meta[name="csrf-token"]').attr('content'),
        type: 'hidden'
      })
    )
    newForm.appendTo('body')
    newForm.submit()
    newForm.remove()
  },
  render: function() {
    var self = this
    return <div className="query">
      <span className="label">Show table</span>
      <Selector name="model"
        values={
          this.props.model_names
        }
        onChange={
          function(model_name) {
            self.setState({ selected_model: model_name })
          }
        }
        showNone="enabled"/>

      <input type="text" className="filter" 
        placeholder="filter query"
        onChange={
        function(e) {
          self.setState({ current_filter: e.target.value })
        }
      }/>

      <input type="button" className="button" value="Search" 
        disabled={ !this.state.selected_model }
        onClick={ 
          function() {
            self.props.postQuery(
              self.state.selected_model,
              self.state.current_filter
            )
          }
        } />
      <input className="button" type="button" value={"\u21af TSV"}
        disabled={ !this.state.selected_model }
        onClick={
          function() {
            self.requestTSV(
              self.state.selected_model,
              self.state.current_filter
            )
          }
        }/>
    </div>
  }
})

SearchTableColumn = React.createClass({
  getInitialState: function() {
    return { sizing: false }
  },
  render: function() {
    var self = this
    var class_set = {
      table_header: true,
      focused_col: this.props.focused
    }
    class_set[ "c" + this.props.column ] = true
    return <div ref='column' className={ classNames(class_set) }
      onMouseDown={
        function(e) {
          e.preventDefault()
          self.setState({sizing: true, x: e.nativeEvent.offsetX, width: self.refs.column.offsetWidth })
        }
      }
      onMouseUp={
        function() {
          self.setState({sizing: false})
        }
      }

      onMouseMove={
        function(e) {
          if (!self.state.sizing) return
          e.preventDefault()
          size_change = e.nativeEvent.offsetX - self.state.x
          $('.c'+self.props.column).width(self.state.width + size_change)
        }
      }
    
      >
      { this.props.label }
    </div>
  }
})

SearchTable = React.createClass({
  getInitialState: function() {
    return {}
  },
  focusCell: function(record_name, column) {
    this.setState({ focus_row: record_name, focus_col: column })
  },
  render: function() {
    var self = this
    var documents = this.props.documents
    var revisions = this.props.revisions
    var template = this.props.template

    if (!documents) return <div className="table"></div>

    var att_names = Object.keys(template.attributes).filter(function(att_name) {
      return template.attributes[att_name].shown
    })

    var att_classes = this.props.att_classes


    return <div className="table">
              <div className="table_item">
              {
                att_names.map(function(att_name,i) {
                  return <SearchTableColumn key={i} 
                    column={ i }
                    focused={ self.state.focus_col == i ? true : false }
                    label={ att_name }
                  />
                })
              }
              </div>
              {
                self.props.record_names.map(
                  function(record_name, j) {
                    var document = documents[record_name]
                    var revision = revisions[record_name]
                    return <div key={ j }
                      className="table_item">
                      {
                        att_names.map(function(att_name, i) {
                          var value = document[ att_name ]

                          var revised_value = revision && revision.hasOwnProperty(att_name) ? revision[att_name] : document[att_name]

                          var class_set = {
                            item_value: true,
                            revised: (self.props.mode == 'edit' && value != revised_value),
                            focused_row: (self.state.focus_row == record_name),
                            focused_col: (self.state.focus_col == i)
                          }

                          if (!att_classes.hasOwnProperty(att_name))
                            return <div className={ classNames(class_set) }> <div className="value">(table)</div> </div>

                          var AttClass = att_classes[att_name]

                          return <div key={i} onClick={
                              function() {
                                self.focusCell( record_name, i )
                              }
                            }
                            className={ classNames(class_set) } >
                            <AttClass 
                              document={ document }
                              template={ template }
                              value={ document[ att_name ] }
                              revision={ revised_value }
                              mode={ self.props.mode }
                              attribute={ template.attributes[att_name] }/>
                          </div>
                        })
                      }
                      </div>
                  })
              }
             </div>
  },
})

Search = React.createClass({
  getInitialState: function() {
    return { mode: 'search', page_size: 10, current_page: 0, record_names: [] }
  },
  setPage: function(page) {
    var self = this
    this.setState({ current_page: page }, function() {
      self.ensurePageRecords()
    })
  },
  page_record_names: function(page) {
    if (!this.state.record_names.length) return null
    return this.state.record_names.slice( this.state.page_size * page, this.state.page_size * (page + 1) )
  },
  ensurePageRecords: function() {
    page_record_names = this.page_record_names(this.state.current_page)
    if (page_record_names && !this.props.hasCompleteRecords(this.state.model_name, page_record_names)) {
      this.props.requestDocuments( this.state.model_name, page_record_names )
    }
  },
  componentDidMount: function() {
    var self = this

    this.props.getModels()
  },
  postQuery: function(model_name, filter) {
    var self = this
    self.props.query(
      model_name, 
      filter,
      function(response) {
        self.setState({
          model_name: model_name,
          record_names: response.record_names, 
          current_page: 0
        }, function() {
          self.ensurePageRecords()
        })

      }
    )
  },
  header_handler: function(action) {
    var self = this
    switch(action) {
      case 'cancel':
        this.setState({mode: 'search'})
        this.props.discardRevisions(
          self.state.model_name,
          self.page_record_names(self.state.current_page, 
                                 self.state.record_names)
        )
        return
      case 'approve':
        if (this.props.hasRevisions) {
          this.setState({mode: 'submit'})
          this.props.submitRevision(
            this.props.revision, 
            function() {
              self.setState({mode: 'search'})
            },
            function ( messages ) {
              self.setState({mode: 'edit'})
              self.props.showMessage(messages.errors || ["### An unknown error occurred.\n\nSeek further insight elsewhere."] )
            }
          )
        } else {
          var page_record_names = self.page_record_names(self.state.current_page, self.state.record_names)
          this.setState({mode: 'search'})
          this.props.discardRevisions(
            self.state.model_name,
            self.page_record_names(self.state.current_page, 
                                   self.state.record_names)
          )
        }
        return
      case 'edit':
        this.setState({mode: 'edit'})
        return
    }
  },
  render: function() {
    var self = this

    var documents
    var revisions
    var att_classes

    var pages = self.state.model_name ? Math.ceil(self.state.record_names.length / self.state.page_size) : null

    var page_record_names = self.page_record_names(self.state.current_page, self.state.record_names)

    if (page_record_names && 
        self.props.hasCompleteRecords(self.state.model_name,
                                      page_record_names)) {
      documents = self.props.documentsFor(
        self.state.model_name, 
        page_record_names
      )
      revisions = self.props.revisionsFor(
        self.state.model_name,
        page_record_names
      )
      template = self.props.templateFor( self.state.model_name ) 

      att_classes = {}
      var att_names = Object.keys(template.attributes).filter(function(att_name) {
        return template.attributes[att_name].shown
      })
      att_names.forEach(function(att_name) {
        var att_class = template.attributes[att_name].attribute_class
        if (att_class != "TableAttribute") 
          att_classes[att_name] = eval(att_class)
      })

    }

    return <div id="search">
        { this.state.mode == 'search' ?
          <div className="control">
            <SearchQuery postQuery={ self.postQuery }
              model_names={ self.props.model_names }/>
            {
              pages != null ? 
                <div className="pages">
                  <div className="page_size">
                  Page size
                  <Selector 
                    values={
                      [ 10, 25, 50, 200 ]
                    }
                    defaultValue={ self.state.page_size }
                    onChange={
                      function(page_size) {
                        var newpages = Math.ceil(self.state.record_names.length / page_size)
                        self.setState({ page_size: page_size, current_page: Math.min(self.state.current_page, newpages-1) },function(){
                          self.ensurePageRecords()
                        })
                      }
                    }
                    showNone="disabled"/>
                  </div>
                  <div className="results">
                    Found { self.state.record_names.length } records in <span className="model_name">{ self.state.model_name }</span>
                  </div>
                <Pager pages={ pages } 
                  current_page={ self.state.current_page }
                  set_page={ self.setPage } >
                </Pager>
                </div>: null
            }
          </div> : null
        }
        {
          documents ?  
            <div className="documents">
              <Header 
                mode={ this.state.mode }
                handler={ this.header_handler }
                can_edit={ this.props.can_edit }/>
              <SearchTable 
                mode={ this.state.mode }
                documents={ documents }
                revisions={ revisions }
                att_classes={ att_classes }
                record_names={ page_record_names }
                template={ template }
              />
            </div> : null
        }
    </div>
  }
})

Search = connect(
  function(state, props) {
    return $.extend({},
      props,
      {
        model_names: Object.keys(state.templates),
        documentsFor: function(model_name, record_names) {
          if (state.templates[model_name] && state.templates[model_name].documents) {
            var documents = {}
            record_names.forEach(function(record_name){
              documents[record_name] = state.templates[model_name].documents[record_name]
            })
            return documents
          }
        },
        revisionsFor: function(model_name, record_names) {
          if (state.templates[model_name] && state.templates[model_name].revisions) {
            var revisions = {}
            record_names.forEach(function(record_name){
              revisions[record_name] = state.templates[model_name].revisions[record_name]
            })
            return revisions
          }
        },
        templateFor: function(model_name) {
          if (state.templates[model_name]) return state.templates[model_name].template
        },
        hasCompleteRecords: function(model_name, record_names) {
          model_info = state.templates[model_name]

          if (!model_info || !record_names) return false

          template = model_info.template

          return record_names.every(function(record_name) {
            record = model_info.documents[record_name]

            if (!record) return false

            return Object.keys(template.attributes).every(function(attribute_name) {
              return template.attributes[attribute_name].attribute_class == "TableAttribute" || record.hasOwnProperty(attribute_name)
            })
          })
        }
      }
    )
  },
  function(dispatch,props) {
    return {
      getModels: function() {
        dispatch(magmaActions.requestModels())
      },
      query: function(model, filter, success) {
        dispatch(magmaActions.queryDocuments(model,filter,success))
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
        dispatch(magmaActions.requestDocuments(model,record_names,success))
      },
    }
  }
)(Search)

module.exports = Search
