import * as React from 'react';

import {formatDate} from '../../utils/dates';

const AccessRadio = ({onUpdate, access, value, disabled}) =>
  (access != value && disabled) ? <span/> :
  <div className='access-radio-group'>
    {
      !disabled && <input
        name='document-access'
        value={ value }
        checked={access== value }
        onChange={ onUpdate }
        type='radio'
        disabled={ disabled }
      />
    }
    <span title={`${value} access`} className={ `label ${value}` }>
      {value}
    </span>
  </div>;

const DocumentDetails = ({
  document: { user, description, updated_at, access },
  onUpdate, editing
}) => {
    let accessRadio;
    if (access) {
    accessRadio =
      (<div className='document-access'>
        <AccessRadio
          onUpdate={onUpdate('access')}
          disabled={!editing}
          access={access}
          value='private'/>
        <AccessRadio
          onUpdate={onUpdate('access')}
          disabled={!editing}
          access={access}
          value='public'/>
      </div>);
  } else {
    accessRadio = null;
  }
    return (
    <div className='document-details'>
      <div className='document-edit-details'>
        <i className='fas fa-clock' title='Updated'/>
        <span>{ formatDate(updated_at) }</span>
        <i className='fas fa-user' title='Author'/>
        <span>{user}</span>
      </div>
      {accessRadio}
      <textarea className='document-description'
                onChange={ onUpdate('description') }
                value={ (description) ? description : '' }
                placeholder='No description'
                disabled={ !editing }
      />
    </div>
  );
}


export default DocumentDetails;
