import * as React from 'react';

export default ({icon, overlay, title, onClick}) =>
  <span className='fa-stack fa-fw' title={title} onClick={ onClick }>
    <i className={ `icon ${icon} fa fa-2x fa-${icon}` }/>
    { overlay && <i className={ `overlay ${overlay} fa fa-stack-1x fa-${overlay}` }/> }
  </span>;
