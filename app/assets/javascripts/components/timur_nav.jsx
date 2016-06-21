TimurNavBar = React.createClass({
  render: function() {
    var self = this
    var login_path = Routes.login_path()

    var tabs = {
      browse: Routes.browse_path(),
      search: Routes.search_path(),
      plot: Routes.plot_path()
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
                   var tab_class = "nav_tab" + (self.props.mode == name ? ' selected' : '')
                   return <div key={ name } className={ tab_class }>
                       <a href={ tabs[name] }> { name } </a>
                     </div>
                 })
               }
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

TimurNav = connect(
  function (state) {
    console.log(state)
    return {
      helpShown: state.timur.help_shown
    }
  }
)(TimurNavBar)

TimurNav.contextTypes = {
  store: React.PropTypes.object
}

module.exports = TimurNav
