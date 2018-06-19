// Framework libraries.
import * as React from 'react';

// Class imports.
import BrowserPane from './browser_pane';

export default class BrowserTab extends React.Component{
  renderPanes(){
    let {tab, mode, revision, template, doc} = this.props;

    let panes = Object.keys(tab.panes).map((pane_name, index)=>{

      let browser_pane_props = {
        template,
        doc,
        revision,
        mode,
        pane: tab.panes[pane_name],
        key: `${pane_name}-${index}`
      };

      return <BrowserPane {...browser_pane_props} />
    });

    return panes;
  }

  render(){
    if(!this.props.tab) return <span className='fas fa-spinner fa-pulse' />;

    return(
      <div id='tab' className={this.props.name}>

        {this.renderPanes()}
      </div>
    );
  }
};
