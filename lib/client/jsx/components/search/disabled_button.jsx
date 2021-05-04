import React from 'react';

export default function DisabledButton({id, disabled, label, onClick}) {
  return (
    <input
      id={id}
      type='button'
      className={disabled ? 'button disabled' : 'button'}
      value={label}
      disabled={disabled}
      onClick={onClick}
    />
  );
}
