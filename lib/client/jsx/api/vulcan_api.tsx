import {checkStatus, headers} from 'etna-js/utils/fetch';

export const fetchWorkflows = () =>
  fetch(
    `${CONFIG.vulcan_host}/api/${CONFIG.project_name}/workflows?tag=plotting`,
    {
      credentials: 'include',
      headers: headers('json')
    }
  ).then(checkStatus);
