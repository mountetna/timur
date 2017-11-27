import React from 'react';

const Selector = ({ label, onChange, options, hasNull = false, value }) => {
  const selectOptions = options.map(option => {
    if (typeof option == 'string') {
      return <option key={option} value={option}>{option}</option>;
    }
    return <option key={option.value} value={option.value}>{option.label}</option>;
  });

  return (
    <div className='input-container'>
      <label>
        {`${label}: `}
        <select onChange={(e) => onChange(e.target.value)} value={value}>
          {hasNull && <option key={null} value={null}></option>}
          {selectOptions}
        </select>
      </label>
    </div>
  );
};

export default Selector;