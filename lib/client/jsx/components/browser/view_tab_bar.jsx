// Framework libraries.
import * as React from 'react';

import {recordMatchesRegex} from '../../utils/view_utils';

const formatName = (name) =>
  name
    .replace(/_/, ' ')
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

const Tab = ({selected, revised, name, onClick}) =>
  selected ? (
    <div className='selected tab'>{formatName(name)}</div>
  ) : (
    <div
      className={revised ? 'revised tab' : 'tab'}
      onClick={() => onClick(name)}
    >
      {formatName(name)}
    </div>
  );

const ViewTabBar = ({
  view: {tabs},
  current_tab,
  revised,
  onClick,
  recordName
}) => {
  const displayableTabs = Object.values(tabs).filter((t) =>
    recordMatchesRegex(recordName, t.regex)
  );
  return displayableTabs.length == 1 ? (
    <div style={{display: 'none'}} />
  ) : (
    <div className='tabbar'>
      <div className='spacer1' />
      {displayableTabs.map((tab, index) => (
        <Tab
          selected={current_tab == tab.name}
          key={index}
          name={tab.name}
          onClick={onClick}
          revised={(revised || {})[tab.name]}
        />
      ))}
      <div className='spacer2' />
    </div>
  );
};

export default ViewTabBar;
