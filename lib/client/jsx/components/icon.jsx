import * as React from 'react';

export default ({icon, overlay, title, className, onClick}) =>
  <span className='fa-stack fa-fw' title={title} onClick={ onClick }>
    <i className={ `icon ${className} ${icon} fa fa-2x fa-${icon}` }/>
    { overlay && <i className={ `overlay ${className} ${overlay} fa fa-stack-1x fa-${overlay}` }/> }
  </span>;
