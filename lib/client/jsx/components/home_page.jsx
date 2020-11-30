import * as React from 'react';
import { connect } from 'react-redux';

import * as _ from 'lodash';

// Module imports.
import { selectUserPermissions } from '../selectors/user_selector';
import { selectProjects } from 'etna-js/selectors/janus-selector';
import { projectNameFull } from 'etna-js/utils/janus';

export default class HomePage extends React.Component{
  renderProjects(){
    let { permissions, projects } = this.props;
    
    if(_.keys(permissions).length <= 0){
      return <span>{'No available projects.'}</span>;
    }

    return <React.Fragment>
      {_.keys(permissions).map( key => {
          let {project_name, role} = permissions[key];
          return <a className='home-page-project-link'
            key={project_name}
            href={`/${project_name}`}>
            {projectNameFull(projects, project_name)} &nbsp;
            <span className='home-page-project-role'>({role})</span>
          </a>
      })}
    </React.Fragment>

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
      permissions: selectUserPermissions(state),
      projects: selectProjects(state)
    }
  )
)(HomePage);
