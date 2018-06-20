// Framework libraries.
import * as React from 'react';

export default class MagmaLink extends React.Component{

  render(){
    let route_args = [
      TIMUR_CONFIG.project_name,
      this.props.model,
      encodeURIComponent(this.props.link)
    ];

    let link_props = {
      'className': 'link',
      'href': Routes.browse_model_path(...route_args)
    };

    return(
      <a {...link_props}>

        {this.props.link}
      </a>
    );
  }
}
