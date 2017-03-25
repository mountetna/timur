import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import { loadState, saveState } from '../localStorage';
import ManifestEditor from './manifest/editor'
import { connect } from 'react-redux'

const create_store = () => {
  let middleWares = [thunk]
  if (process.env.NODE_ENV != "production") {
    middleWares.push(createLogger())
  }
  const persistedState = loadState()
  return Redux.applyMiddleware(...middleWares)(Redux.createStore)(rootReducer, persistedState)
}

var Timur = React.createClass({
  render: function () {
    var component
    if (this.props.appMode == 'manifesto') {
      component = <ManifestEditor />
    } else if (this.props.mode == 'browse') 
      component = <Browser 
        can_edit={ this.props.can_edit }
        model_name={ this.props.model_name }
        record_name={ this.props.record_name } />
    else if (this.props.mode == 'plot')
      component = <Plotter />
    else if (this.props.mode == 'search')
      component = <Search can_edit={ this.props.can_edit }/>
    else if (this.props.mode == 'activity')
      component = <Activity activities={ this.props.activities }/>
    else if (this.props.mode == 'noauth')
      component = <Noauth user={ this.props.user }/>

    return  <div>
              <TimurNav user={ this.props.user }
                can_edit={ this.props.can_edit }
                mode={ this.props.mode }
                environment={this.props.environment}
                appMode={this.props.appMode}/>
              <Messages/>
              { component }
           </div>
  }
})

//TODO fix this. a bunch of hacks for manifest tab until start using react-router
const mapStateToProps = (state) => ({ appMode: state.appMode })
Timur = connect(mapStateToProps)(Timur)


module.exports = (props) => {
  var store = create_store()

  store.subscribe(() => {
    saveState({
      manifests: store.getState().manifests,
    });
  })

  window.store = store

  return (
    <Provider store={store}>
      <Timur {...props}/>
    </Provider>
  )
}
