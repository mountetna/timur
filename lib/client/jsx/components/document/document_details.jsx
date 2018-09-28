import * as React from 'react';

import {formatDate} from '../../utils/dates';

const AccessRadio = ({onUpdate, access, value, disabled}) =>
  <span>
    <input
      name='document-access'
      value={ value }
      checked={access== value }
      onChange={ onUpdate }
      type='radio'
      disabled={ disabled }
    />
    { value.toUpperCase() }
  </span>;

const DocumentDetails = ({
  document: { user, description, updated_at, access },
  onUpdate, editing
}) => (
  <div className='document-details'>
    Updated <strong>{ formatDate(updated_at) }</strong> by <strong>{user}</strong>
    <br />
    Access
    <AccessRadio
      onUpdate={ onUpdate('access') }
      disabled={ !editing }
      access={ access }
      value='private'/>
    <AccessRadio
      onUpdate={ onUpdate('access') }
      disabled={ !editing }
      access={ access }
      value='public'/>
    <br />
    <textarea className='document-description'
      onChange={ onUpdate('description') }
      value={ (description) ? description : '' }
      placeholder='No description'
      disabled={ !editing }
    />
  </div>
);

export default DocumentDetails;
