// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

export class TimurRootNav extends React.Component{

  render() {
    let login_path = Routes.login_path();
    let login = this.props.user || <a href={ login_path}>Login</a>;
    let heading;
    let logo_id;

    if (this.props.environment == 'development') {
      heading = <span>Timur Development</span>;
      logo_id = 'dev';
    }
    else {
      heading = <span>Timur <b>:</b> Data Browser</span>;
      logo_id = 'normal';
    }

    return <div id='header'>
              <div id='logo'>
                <a href='/'>
                  <div id={ logo_id }
                    className={ Object.keys(this.props.exchanges).length > 0 ? 'throb' : null }
                  >
                    <div className='image'/>
                  </div>
                </a>  
              </div>
              <div id='help_float'>
              </div>
              <div id='heading'>
                {heading}
              </div>
              <div id='nav' className='root-nav'>
                <div id='login'               >
                  { login }
                </div>
              </div>
           </div>
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return {
    exchanges: state.exchanges
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {};
};

export const TimurRootNavContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TimurRootNav);