import React, {useEffect} from 'react';
import {useReduxState} from 'etna-js/hooks/useReduxState';

// Module imports.
import { selectUserPermissions } from '../selectors/user_selector';
import { selectProjects } from 'etna-js/selectors/janus-selector';
import { projectNameFull } from 'etna-js/utils/janus';
import {fetchProjectsAction} from 'etna-js/actions/janus-actions';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';

const Project = ({project_name, full_name, role, privileged}) =>
  <div className='project'>
    <div className='project_name'>
        <a className='home-page-project-link' href={`/${project_name}`}>
        { project_name }
      </a>
    </div>
    <div className='role'>
        {role}{ privileged ? ', privileged access' : '' }
    </div>
    <div className='full_name'>
      { full_name }
    </div>
  </div>;

const HomePage = () => {
  const invoke = useActionInvoker();
  const { my_projects } = useReduxState(
    state => {
      let permissions = selectUserPermissions(state);
      let projects = selectProjects(state);

      let my_projects = Object.values(permissions).map(
        ({project_name,...perms})=>({
          project_name, ...perms,
          full_name: projectNameFull(projects, project_name)
        })
      ).sort(({project_name: n1},{project_name: n2}) => n1 < n2 ? -1 : n1 > n2 ? 1 : 0);

      return { my_projects };
    }
  );

  useEffect( () => {
    invoke(fetchProjectsAction());
  }, []);

  return <div className='home_page'>
    <div className='title'>Available Projects</div>
    <div className='projects'>
      <div className='project header'>
        <div className='project_name'> project_name </div>
        <div className='role'> role </div>
        <div className='full_name'> title </div>
      </div>
      {
        my_projects.length == 0
          ? <span>{'No available projects.'}</span>
          : my_projects.map((project, i) => <Project key={i} {...project} />)
      }
    </div>
  </div>;
}

export default HomePage;
