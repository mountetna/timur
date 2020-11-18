// Framework libraries.
import * as React from 'react';

// Class imports.
import ViewPane from './view_pane';

const ViewTab = ({ tab, ...pane_props }) =>
  tab ?
    <div id='tab'>
      {
        Object.keys(tab.panes).map(pane_name=>
          <ViewPane
            { ...pane_props }
            pane={ tab.panes[pane_name] }
            key={ pane_name }
          />
        )
      }
    </div>
  : <span className='fas fa-spinner fa-pulse' />;

export default ViewTab;
