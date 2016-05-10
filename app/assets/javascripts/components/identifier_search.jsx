var IdentifierSearch = React.createClass({
  getInitialState: function() {
    return { match_string: '', has_focus: false }
  },
  componentWillMount: function() {
    this.props.requestIdentifiers()
  },
  find_matches: function() {
    var self = this
    
    if (!this.state.has_focus || !this.props.identifiers || !this.state.match_string || this.state.match_string.length < 2) return null

    var match_exp = new RegExp(this.state.match_string, "i")
    var matches

    Object.keys(this.props.identifiers).forEach(function(model_name) {
      var identifiers = self.props.identifiers[model_name]

      identifiers.forEach(function(name) {
        if (name.match(match_exp)) {
          matches = matches || {}
          matches[model_name] = (matches[model_name] || []).concat(name)
        }
      })
    })
    return matches
  },
  render: function() {
    var self = this

    var matching_identifiers = this.find_matches()

    return <div id="identifier_search"
                  onBlur={
                    function(e) {
                      setTimeout(function() {
                        self.setState({has_focus: false})
                      },200)
                    }
                  }
                  onFocus={
                    function(e) {
                      self.setState({has_focus: true})
                    }
                  }>
              <div className="search">
                <span className="fa fa-search"/>
                <input type="text" 
                  value={ this.state.match_string }
                  onChange={
                    function(e) {
                      self.setState({match_string: e.target.value })
                    }
                  }
                  />
              </div>
              {
                matching_identifiers ? 
                <div className="drop_down">
                  {
                    Object.keys(matching_identifiers).map(function(model_name) {
                      var matches = matching_identifiers[model_name]
                      return <div key={model_name}>
                              <div className="title">{ model_name }</div>
                              <div className="list">
                              {
                                matches.map(function(identifier) {
                                  return <div key={identifier} className="identifier">
                                    <MagmaLink link={identifier} model={ model_name } />
                                  </div>
                                })
                              }
                              </div>
                             </div>
                    })
                  }
                </div>
                : null
              }
           </div>
  }
})

IdentifierSearch = connect(
  function(state,props) {
    var idents = {}

    Object.keys(state.templates).forEach(function(model_name) {
      idents[model_name] = Object.keys(state.templates[model_name].documents)
    })
    return {
      identifiers: Object.keys(idents).length ? idents : null
    }
  },
  function(dispatch,props) {
    return {
      requestIdentifiers: function() {
        dispatch(magmaActions.requestIdentifiers())
      }
    }
  }
)(IdentifierSearch)

module.exports = IdentifierSearch
