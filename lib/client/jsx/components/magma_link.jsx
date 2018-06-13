// Framework libraries.
import * as React from 'react';

export default class MagmaLink extends React.Component{

  render(){

    /*
    * 'this.props.model' and 'mdl_nm' are different. The models from Magma
    * namespaced with the project. The view data from Timur (which has a
    * correspondence with the Magma models) is not namespaced.
    */
    let mdl_nm = this.props.model.split('_');
    let prjt_nm = mdl_nm.shift();
    mdl_nm = mdl_nm.join('_');
    if(mdl_nm == '') mdl_nm = this.props.model;

    let route_args = [
      TIMUR_CONFIG.project_name,
      mdl_nm,
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
