import 'babel-polyfill'
import 'promise-polyfill'
import 'whatwg-fetch'

import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import Manifests from './manifest/manifests'
import {connect} from 'react-redux'
import TimurNav from './timur_nav'
import ModelMap from './model_map'
import Search from './search/search'

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
      'model_name': this.props.model_name,
      'record_name': this.props.record_name
    };

    var search_props = {
      'can_edit': this.props.can_edit,
    };

    var timur_nav_props = {
      'user': this.props.user,
      'can_edit': this.props.can_edit,
      'mode': this.props.mode,
      'environment': this.props.environment,
    };

    var manifest_props = {
      'currentUser': this.props.user,
      'isAdmin': this.props.is_admin,
    };

    switch(this.props.mode){
      case 'manifests':
        component = <Manifests {...manifest_props} />;
        break;
      case 'browse':
        component = <Browser {...browser_props} />;
        break;
      case 'map':
        component = <ModelMap />;
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
        component = <Noauth user={this.props.user} />;
        break;
      default:
        break;
    }

    return(
      <div id='ui-container'>

        <TimurNav {...timur_nav_props} />
        <Messages/>
        {component}
      </div>
    );
  }
});

// Initializes the render.
export default (props)=>(
  <Provider store={createStore()}>

    <Timur {...props}/>
  </Provider>
);
