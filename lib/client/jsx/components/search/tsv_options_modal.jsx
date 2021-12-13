import React from 'react';

import DisabledButton from './disabled_button';

export default function TsvOptionsModal({options, onDownload, disabled}) {
  return (
    <div className='tsv-options-modal'>
      <div className='header'>TSV Download Options</div>
      <div className='options-tray tray'>
        {options.map((option, index) => {
          return (
            <label
              className={`${option.label.toLowerCase().replaceAll(' ', '_')}`}
              key={index}
            >
              <input
                checked={option.checked}
                onChange={() => option.onChange(!option.checked)}
                type='checkbox'
              />
              {` ${option.label}`}
            </label>
          );
        })}
      </div>
      <div className='options-action-wrapper'>
        <DisabledButton
          id='download-tsv-btn'
          label={'\u21af Download'}
          disabled={disabled}
          onClick={onDownload}
        />
      </div>
    </div>
  );
}
