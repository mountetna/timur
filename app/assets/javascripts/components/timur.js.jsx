Timur = React.createClass({
  getInitialState: function() {
    return { errors: [] }
  },
  show_errors: function(errors) {
    this.setState( { errors: errors } );
  },
  render: function() {
    var component;
    if (this.props.mode == 'browser') component = <Browser model={ this.props.model } show_errors={ this.show_errors } record={ this.props.record }/>;
    else if (this.props.mode == 'plotter') component = <Plotter show_errors={ this.show_errors }/>;

    return <div>
              <TimurNav user={ this.props.user } environment={ this.props.environment}/>
              <Errors errors={ this.state.errors }/>
              { component }
           </div>;
  }
});

TimurNav = React.createClass({
  render: function() {
    var browse_path = Routes.browse_path();
    var search_path = Routes.search_path();
    var plot_path = Routes.plot_path();
    var login_path = Routes.login_path();

    var login;
    var heading;
    var logo;
    login = this.props.user || <a href={ login_path}>Login</a>;
    if (this.props.environment == 'development') {
      heading = <span>Timur Development</span>;
      logo = <a href="/"> <div id="devlogo"> &nbsp; </div> </a>;
    }
    else {
      heading = <span>Timur <b>:</b> Data Browser</span>;
      logo = <a href="/"> <div id="logo"> &nbsp; </div> </a>;
    }
    return <div id="header">
             { logo }
             <div id="heading">
             { heading }
             </div>
             <div id="nav">
               <div className="nav_tab">
                 <a href={ browse_path }> Browse </a>
               </div>
               <div className="nav_tab">
                 <a href={ search_path }> Search </a>
               </div>
               <div className="nav_tab">
                 <a href={ plot_path }> Plot </a>
               </div>
               <div id="login">
                 { login }
               </div>
             </div>
           </div>;
  }
});
