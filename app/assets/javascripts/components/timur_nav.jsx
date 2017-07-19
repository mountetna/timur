import { toggleConfig, changeMode } from '../actions/timur_actions'
import { Component } from 'react'

class TimurNav extends Component{
  throbberClass(){
    return (Object.keys(this.props.exchanges).length) > 0 ? 'throb' : null;
  }

  /*
  render_throbber(){

    console.log('sup');
    return Array(36).fill().map((val, index)=>{
      let x = (d, r)=>{Math.cos(Math.PI * d / 180) * r + 35};
      let y = (d, r)=>{Math.sin(Math.PI * d / 180) * r + 35};
      let c_name = (index%2 == 0) ? 'long' : 'short';
      let c_num = (index%2 == 0) ? 42 : 32;
      let mult = index * 10;

      var x_point = x(mult, c_num);
      var y_point = y(mult, c_num);
      var x_len = x(mult, 25);
      var y_len = y(mult, 25);
      var desc = 'M '+x_point+','+y_point+' L '+x_len+','+y_len;

      return <path className={c_name} key={index} d={desc} />;
    });
  }
  */

  renderThrobber(){
    return Array(36).fill().map((_,i) => {
      let x = (d,r) => Math.cos(Math.PI * d / 180) * r + 35
      let y = (d,r) => Math.sin(Math.PI * d / 180) * r + 35
      return <path className={ i%2==0 ? "long" : "short"} key={i} d={ `M ${x(i*10, (i%2==0 ? 42 : 32))}, ${y(i*10, (i%2==0 ? 42 : 32)) }
             L ${x(i*10,25)}, ${y(i*10, 25)}` }/>
     
    })
  }

  logoId(){
    return (this.props.environment == 'development') ? 'dev' : 'normal';
  }

  renderHeading(){
    var heading = <span>{'Timur'}<b>{':'}</b>{'Data Browser'}</span>;

    if(this.props.environment == 'development'){
      heading = <span>{'Timur Development'}</span>;
    }

    return heading;
  }

  renderTabs(){
    var tabs = {
      'browse': Routes.browse_path(this.props.project_name),
      'search': Routes.search_path(this.props.project_name),
      'map': Routes.map_path(this.props.project_name),
      'manifests': Routes.manifests_path(this.props.project_name),
    };

    return(
      Object.keys(tabs).map((name)=>{

        var mode = 'nav_tab';
        if(this.props.mode == name) mode += ' selected';

        return(
          <div key={name} className={mode}>

            <a href={tabs[name]}>

              {name}
            </a>
          </div>
        );
      })
    );
  }

  renderActivityTab(){
    if(this.props.can_edit){
      return(
        <div className='nav_tab'>
          <a href='/'>

            Activity
          </a>
        </div>
      );
    }

    return null;
  }

  renderNavTab(){

    return(
      <div className='nav_tab'>

        <a onClick={(e)=>this.props.toggleConfig('help_shown')}>

          {this.props.helpShown ? 'Hide Help' : 'Help'}
        </a>
      </div>
    );
  }

  renderLogin(){

    var login_path = Routes.login_path();
    var login_path = '';
    return(
      <div id='login'>

        {this.props.user || <a href={login_path}>Login</a>}
      </div>
    );
  }

  render(){
    return(
      <div id='header'>

        <div id='logo'>

          <a href='/'>

            <div id={this.logoId()} className={this.throbberClass()}>

              <div className='image' />
            </div>
          </a>
        </div>
        <div id='help_float'>

          <Help info='timur' />
        </div>
        <div id='heading'>

          {this.renderHeading()}
        </div>
        <div id='nav'>

          {this.renderTabs()}
          {this.renderActivityTab()}
          {this.renderNavTab()}
          <IdentifierSearch project_name={this.props.project_name} />
          {this.renderLogin()}
        </div>
      </div>
    );
  }
}

export default connect(
  (state)=>({
    'helpShown': state.timur.help_shown,
    'exchanges': state.exchanges
  }),
  { 
    changeMode,
    toggleConfig
  }
)(TimurNav);
