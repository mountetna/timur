// Framework libraries.
import * as React from 'react';
import Link from './link';

export default class MagmaLink extends React.Component{

  render(){
    let { link, model } = this.props;

    return(
      <Link
        link={
          Routes.browse_model_path(
            TIMUR_CONFIG.project_name,
            model,
            encodeURIComponent(link)
          )
        }>
        { link }
      </Link>
    );
  }
}
