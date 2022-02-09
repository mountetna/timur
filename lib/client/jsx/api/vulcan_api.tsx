import {checkStatus, headers} from 'etna-js/utils/fetch';

import {Workflow, QueryPayload} from '../contexts/query/query_types';

export const fetchWorkflows = () =>
  fetch(
    `${CONFIG.vulcan_host}/api/${CONFIG.project_name}/workflows?tag=plotting`,
    {
      credentials: 'include',
      headers: headers('json')
    }
  ).then(checkStatus);

export const createAndOpenFigure = (workflow: Workflow, payload: QueryPayload) => {
  fetch(
    `${CONFIG.vulcan_host}/api/${CONFIG.project_name}/figures/create`,
    {
      method: 'POST',
      credentials: 'include',
      headers: headers('json'),
      body: JSON.stringify(payload)
    }
  )
    .then(checkStatus)
    .then(({id}) => {
      window.open(
        `${CONFIG.vulcan_host}/${CONFIG.project_name}/figures/${id}`,
        '_blank'
      );
    });
};
