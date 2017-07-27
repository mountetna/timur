import 'babel-polyfill'
import 'promise-polyfill'
import 'whatwg-fetch'

import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import Manifests from './manifest/manifests'
import {connect} from 'react-redux'
import TimurNav from './timur_nav'
import ModelMap from './model_map'

const createStore = ()=>{
  let middleWares = [thunk];
  if(process.env.NODE_ENV != 'production') middleWares.push(createLogger());
  return Redux.applyMiddleware(...middleWares)(Redux.createStore)(rootReducer);
}

var Timur = React.createClass({

  'render': function(){
    var component = null;

    var browser_props = {
      'can_edit': this.props.can_edit,
      'project_name': this.props.project_name,
      'model_name': this.props.model_name,
      'record_name': this.props.record_name
    };

    var search_props = {
      'can_edit': this.props.can_edit,
      'project_name': this.props.project_name
    }

    var timur_nav_props = {
      'user': this.props.user,
      'can_edit': this.props.can_edit,
      'mode': this.props.mode,
      'environment': this.props.environment,
      'appMode': this.props.appMode,
      'project_name': this.props.project_name
    };

    switch(this.props.mode){
      case 'manifesto':
        component = <Manifests isAdmin={this.props.is_admin} />;
        break;
      case 'browse':
        component = <Browser {...browser_props} />;
        break;
      case 'map':
        component = <ModelMap />
        break;
      case 'plot':
        component = <Plotter />;
        break;
      case 'search':
        component = <Search  {...search_props} />; 
        break;
      case 'activity':
        component = <Activity activities={this.props.activities} />;
        break;
      case 'noauth':
        component = <Noauth user={this.props.user} />
        break;
      default:
        break;
    }

    return(
      <div>

        <TimurNav {...timur_nav_props} />
        <Messages />
        {component}
      </div>
    );
  }
});

/*
 * TODO fix this. a bunch of hacks for manifest tab until start using
 * react-router
 */
const mapStateToProps = (state)=>({'appMode': state.appMode})
Timur = connect(mapStateToProps)(Timur);

// Initializes the render.
export default (props)=>(
  <Provider store={createStore()}>

    <Timur {...props}/>
  </Provider>
);
