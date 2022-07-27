// Framework libraries.
import * as React from 'react';

// Class imports.
import ViewPane from './view_pane';

import {reducePanes} from '../../utils/view_utils';

const ViewTab = ({ tab, recordName, ...pane_props }) => {
  if (!tab) return <span className='fas fa-spinner fa-pulse' />;

  let tab_groups = reducePanes(tab.panes, recordName);
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
