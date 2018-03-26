import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Module imports.
import * as TimurActions from '../../javascripts/actions/timur_actions';

export class Root extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.props.fetchPermissionsSettings();
  }
 
  render(){
    let {token_permissions} = this.props;
    let link_props = {className: 'project-link'};

    return (
      <div className='project-selector-panel'>
        <div className='project-selector-header'>

          Available Projects
          {
            token_permissions ? (
              token_permissions.map((obj, index)=>{
                link_props['key'] = index; 
                link_props['href'] =  '\\' + obj.project_name;
                return (
                  <a {...link_props}>
                    {obj.project_name} &nbsp;
                    <span className='project-role'>({obj.role})</span>
                  </a>
                )
              })
            ) :
              null
          } 
        </div>
      </div>
    )
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

export const RootContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);