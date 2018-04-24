import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Module imports.
import * as TimurActions from '../../javascripts/actions/timur_actions';

export class HomePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.props.fetchPermissionsSettings();
  }

  renderProjects(){
    if(!this.props.token_permissions){
      return <span>{'No available projects.'}</span>;
    }

    let link_props = {className: 'home-page-project-link'};
    return this.props.token_permissions.map((permission, index)=>{
      link_props['key'] = index;
      link_props['href'] =  '/' + permission.project_name;
      return(
        <a {...link_props}>

          {permission.project_name} &nbsp;
          <span className='home-page-project-role'>({permission.role})</span>
        </a>
      );
    });
  }

  render(){
    return(
      <div className='browser project'>

        <div className='home-page-header-group'>

          <div className='page-detail-group'>

            {'Available Projects'}
          </div>
        </div>
        <div className='browser-tab'>

          {this.renderProjects()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  if(state.timur.user === undefined) return {};
  return {token_permissions: state.timur.user.permissions};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchPermissionsSettings: ()=>{
      dispatch(TimurActions.addTokenUser());
    } 
  };
};

export const HomePageContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
