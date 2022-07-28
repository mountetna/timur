// Framework libraries.
import * as React from 'react';

// Class imports.
import ViewPane from './view_pane';

import {recordMatchesRegex} from '../../utils/view_utils';

const ViewTab = ({ tab, ...pane_props }) => {
  if (!tab) return <span className='fas fa-spinner fa-pulse' />;

  const { regex, panes } = tab;
  const { record_name } = pane_props;

  if (!recordMatchesRegex(record_name, regex)) {
    return null;
  }

  let tab_groups = panes.reduce((groups, pane) => {
    groups[pane.group] = groups[pane.group] || [];
    groups[pane.group].push(pane);
    return groups;
  }, {});
  console.log({tab_groups});
  return <div id='tab'>
    {
      Object.keys(tab_groups).map((pane_group,i) =>
        <div className='pane_group' key={i}>
          {
            tab_groups[pane_group].map( pane =>
              <ViewPane
                { ...pane_props }
                pane={ pane }
                key={ pane.name }
              />
            )
          }
        </div>
      )
    }
  </div>
}

export default ViewTab;
