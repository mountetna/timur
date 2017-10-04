// Class imports.
import * as React from 'react';

export default class BrowserTab extends React.Component{
  renderPanes(){
    let panes = this.props.tab.panes.map((pane)=>{

      let browser_pane_props = {
        'mode': this.props.mode,
        'pane': pane,
        'name': pane.name,
        'revision': this.props.revision,
        'template': this.props.template,
        'document': this.props.document,
        'key': pane.name
      };
      return <BrowserPane {...browser_pane_props} />
    });

    return panes;
  }

  render(){
    if(!this.props.tab) return <span className='fa fa-spinner fa-pulse' />;

    return(
      <div id='tab' className={this.props.name}>

        {this.renderPanes()}
      </div>
    );
  }
};
