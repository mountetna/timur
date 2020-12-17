// Framework libraries.
import * as React from 'react';

// Class imports.
import ViewPane from './view_pane';

const ViewTab = ({ tab, ...pane_props }) =>
  tab ?
    <div id='tab'>
      {
        tab.panes.map(pane=>
          <ViewPane
            { ...pane_props }
            pane={ pane }
            key={ pane.name }
          />
        )
      }
    </div>
  : <span className='fas fa-spinner fa-pulse' />;

export default ViewTab;
