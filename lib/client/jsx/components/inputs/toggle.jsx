import React, {useEffect, useState, useCallback} from 'react';

const Toggle = ({label, selected, onClick}) =>
  <div className={ `toggle ${selected ? 'selected' : ''}` } onClick={onClick}>
    <span className='text'>{ label }</span>
    <span className='slider'/>
  </div>;

export default Toggle
