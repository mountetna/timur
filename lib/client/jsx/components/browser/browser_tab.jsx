// Framework libraries.
import * as React from 'react';

// Class imports.
import BrowserPane from './browser_pane';

const BrowserTab = ({ tab, ...pane_props }) =>
  tab ?
    <div id='tab'>
      {
        Object.keys(tab.panes).map(pane_name=>
          <BrowserPane
            { ...pane_props }
            pane={ tab.panes[pane_name] }
            key={ pane_name }
          />
        )
      }
    </div>
  : <span className='fas fa-spinner fa-pulse' />;

export default BrowserTab;
