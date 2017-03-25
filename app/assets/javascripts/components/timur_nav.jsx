import { changeMode } from '../actions/timur_actions'

var TimurNavBar = React.createClass({
  render: function() {
    var self = this
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
                 <div id={ logo_id }> &nbsp; 
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
                 Object.keys(tabs).map(function(name) {
                   var tab_class = "nav_tab" + ((self.props.mode == name && !self.props.appMode) ? ' selected' : '')
                   return <div key={ name } className={ tab_class }>
                       <a href={ tabs[name] }> { name } </a>
                     </div>
                 })
               }
               <div className={'nav_tab' + (self.props.appMode == 'manifesto' ? ' selected' : '')}>
                  <a onClick={self.props.changeMode.bind(self, 'manifesto')}>Manifesto</a>
                </div>
               {
                 this.props.can_edit ?
                 <div className="nav_tab">
                   <a href={ Routes.activity_path() }>Activity</a>
                 </div>
                 : null
               }
               <div className="nav_tab">
                 <a onClick={ 
                   function(e) {
                     self.props.dispatch(timurActions.toggleConfig('help_shown'))
                   }
                 }>
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
})

var TimurNav = connect(
  function (state) {
    return {
      helpShown: state.timur.help_shown
    }
  },
  { changeMode }
)(TimurNavBar)

TimurNav.contextTypes = {
  store: React.PropTypes.object
}

module.exports = TimurNav
