Timur = React.createClass({
  create_store: function() {
    return Redux.applyMiddleware(thunk)(Redux.createStore)(Redux.combineReducers({
      timur: timurReducer,
      messages: messageReducer,
      templates: magmaReducer,
      plots: plotReducer
    }))
  },
  render: function () {
    var component;
    if (this.props.mode == 'browser') 
      component = <Browser 
        model_name={ this.props.model_name }
        record_name={ this.props.record_name } />;
    else if (this.props.mode == 'plotter')
      component = <Plotter />;
    else if (this.props.mode == 'search')
      component = <Search />;

    return <Provider store={ this.create_store() }>
            <div>
              <TimurNav user={ this.props.user } environment={this.props.environment}/>
              <Messages/>
              { component }
           </div>
    </Provider>
  }
})

module.exports = Timur
