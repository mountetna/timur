import { toggleConfig, changeMode } from '../actions/timur_actions'
import { Component } from 'react'

class TimurNav extends Component {
  render() {
    var login_path = Routes.login_path()

    var tabs = {
      browse: Routes.browse_path(),
      search: Routes.search_path()
    }

    var login
    var heading
    var logo_id

    login = this.props.user || <a href={ login_path}>Login</a>
    if (this.props.environment == 'development') {
      heading = <span>Timur Development</span>
      logo_id = "dev"
    }
    else {
      heading = <span>Timur <b>:</b> Data Browser</span>
      logo_id = "normal"
    }

    //TODO fix hacky addition of Manifesto tab
    return <div id="header">
             <div id="logo">
               <a href="/">
                 <div id={ logo_id }
                   className={ Object.keys(this.props.exchanges).length > 0 ? "throb" : null }
                 >
                   <div className="image"/>
                 </div>
               </a>
             </div>
             <div id="help_float">
                 <Help info="timur"/>
              </div>
             <div id="heading">
               { heading }
             </div>
             <div id="nav">
               {
                 Object.keys(tabs).map((name) =>
                   <div key={ name } 
                     className={ "nav_tab" + ((this.props.mode == name && !this.props.appMode) ? ' selected' : '') }>
                       <a href={ tabs[name] }> { name } </a>
                     </div>
                 )
               }
               <div className={'nav_tab' + (this.props.appMode == 'manifesto' ? ' selected' : '')}>
                  <a onClick={this.props.changeMode.bind(self, 'manifesto')}>Manifests</a>
                </div>
               {
                 this.props.can_edit ?
                 <div className="nav_tab">
                   <a href={ Routes.activity_path() }>Activity</a>
                 </div>
                 : null
               }
               <div className="nav_tab">
                 <a onClick={ (e) => this.props.toggleConfig('help_shown') }>
                 {
                   this.props.helpShown ? 'Hide Help' : 'Help'
                 }
                 </a>
               </div>
               <IdentifierSearch/>
               <div id="login">
                 { login }
               </div>
             </div>
           </div>
  }
}

export default connect(
  (state) =>({
    helpShown: state.timur.help_shown,
    exchanges: state.exchanges
  }),
  { 
    changeMode,
    toggleConfig
  }
)(TimurNav)
