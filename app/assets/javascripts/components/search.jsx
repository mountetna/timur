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
            self.props.requestTSV(
              self.state.selected_model,
              self.state.current_filter
            )
          }
        }/>
    </div>
  }
})

SearchTable = React.createClass({
  render: function() {
    var self = this
    var documents = this.props.documents
    var template = this.props.template

    if (!documents) return <div className="table"></div>

    var att_names = Object.keys(template.attributes).filter(function(att_name) {
      return template.attributes[att_name].shown
    })

    var att_classes = {}


    att_names.forEach(function(att_name) {
      var att_class = template.attributes[att_name].attribute_class
      if (att_class != "TableAttribute") 
        att_classes[att_name] = eval(att_class)
    })

    return <div className="table">
              <div className="table_item">
              {
                att_names.map(function(att_name,i) {
                  return <div key={i} className="table_header">{ att_name }</div>
                })
              }
              </div>
              {
                documents.map(
                  function(document) {
                    return <div key={ document.id }
                      className="table_item">
                      {
                        att_names.map(function(att_name, i) {
                          var value = document[ att_name ]

                          if (!att_classes.hasOwnProperty(att_name)) return <div className="value"> (table) </div>;

                          var AttClass = att_classes[att_name]

                          return <div key={i} className="item_value">
                            <AttClass document={ document } 
                              template={ template }
                              value={ document[ att_name ] }
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
    if (!this.props.hasCompleteRecords(this.state.model_name, page_record_names)) {
      this.props.requestDocuments( this.state.model_name, page_record_names )
    }
  },
  componentDidMount: function() {
    var self = this

    this.props.getModels()
  },
  requestTSV: function(model_name, filter) {
    console.log("Submitting form.")
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
    console.log(newForm)
    newForm.appendTo('body')
    newForm.submit()
    newForm.remove()
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
  render: function() {
    var self = this

    var documents

    var pages = self.state.record_names.length ? Math.ceil(self.state.record_names.length / self.state.page_size) : null

    var page_record_names = self.page_record_names(self.state.current_page, self.state.record_names)

    if (page_record_names && 
        self.props.hasCompleteRecords(self.state.model_name,
                                      page_record_names)) {
      documents = self.props.documentsFor(
        self.state.model_name, 
        page_record_names
      )
    }

    return <div id="search">
        <div className="control">
        <SearchQuery postQuery={ self.postQuery }
          requestTSV={ self.requestTSV }
          model_names={ self.props.model_names }/>
        {
          pages ? 
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
        </div>
        {
          documents ?  
            <SearchTable 
              documents={ documents }
              template={
                this.props.templateFor(
                  this.state.model_name
                ) 
              }
            /> : null
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
          if (state.templates[model_name] && state.templates[model_name].documents)
          return record_names.map(function(record_name){
            return state.templates[model_name].documents[record_name]
          })
        },
        templateFor: function(model_name) {
          if (state.templates[model_name]) return state.templates[model_name].template
        },
        hasCompleteRecords: function(model_name, record_names) {
          model_info = state.templates[model_name]

          if (!model_info) return false

          template = model_info.template

          return record_names.every(function(record_name) {
            record = model_info.documents[record_name]

            if (!record) return false

            console.log(Object.keys(template.attributes).filter(function(attribute_name) {
              return !(template.attributes[attribute_name].attribute_class == "TableAttribute" || record.hasOwnProperty(attribute_name))
            }))

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
      requestDocuments: function(model, record_names, success) {
        dispatch(magmaActions.requestDocuments(model,record_names,success))
      },
    }
  }
)(Search)

module.exports = Search
