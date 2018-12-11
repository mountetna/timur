import * as React from 'react';
import { connect } from 'react-redux';

// Module imports.
import { selectUserPermissions } from '../selectors/user_selector';

export class HomePage extends React.Component{
  renderProjects(){
    let { permissions } = this.props;
    if(permissions.length <= 0){
      return <span>{'No available projects.'}</span>;
    }

    return permissions.map(({project_name,role})=>
        <a className='home-page-project-link'
          key={project_name}
          href={`/${project_name}`}>
          {project_name} &nbsp;
          <span className='home-page-project-role'>({role})</span>
        </a>
    );
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

export const HomePageContainer = connect(
  (state = {}, own_props)=>(
    {
      permissions: selectUserPermissions(state)
    }
  )
)(HomePage);
