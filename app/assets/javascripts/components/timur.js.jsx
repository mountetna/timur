import "babel-polyfill"
import 'promise-polyfill'
import 'whatwg-fetch'

import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import Manifests from './manifest/manifests'
import { connect } from 'react-redux'
import TimurNav from './timur_nav'
import ModelMap from './model_map'

const createStore = () => {
  let middleWares = [thunk]
  if (process.env.NODE_ENV != "production") {
    middleWares.push(createLogger())
  }
  return Redux.applyMiddleware(...middleWares)(Redux.createStore)(rootReducer)
}

var Timur = React.createClass({
  render: function () {
    var component
    if (this.props.appMode == 'manifesto') {
      component = <Manifests isAdmin={this.props.is_admin} />
    } else if (this.props.mode == 'browse') 
      component = <Browser 
        can_edit={ this.props.can_edit }
        model_name={ this.props.model_name }
        record_name={ this.props.record_name } />
    else if (this.props.mode == 'map')
      component = <ModelMap />
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


export default (props) => (
  <Provider store={createStore()}>
    <Timur {...props}/>
  </Provider>
)
