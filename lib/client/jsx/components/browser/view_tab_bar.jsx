// Framework libraries.
import * as React from 'react';

const formatName = name => (
  name.replace(/_/, ' ').replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
);

const Tab = ({selected,revised,name,onClick}) =>
  selected ?
  <div className='selected tab'>
    {formatName(name)}
  </div>
  :
  <div className={ revised ? 'revised tab' : 'tab' }
    onClick={ () => onClick(name) }>
    {formatName(name)}
  </div>;

const ViewTabBar = ({view: { tabs }, current_tab, revised, onClick}) =>
  (Object.keys(tabs).length == 1) ? <div style={{display: 'none'}} />
  : <div className='tabbar'>
      <div className='spacer1' />
      {
        Object.values(tabs).map((tab, index)=>
          <Tab selected={current_tab == tab.name}
            key={index}
            name={tab.name}
            onClick={onClick}
            revised={ (revised||{})[tab.name] } />
        )
      }
      <div className='spacer2' />
    </div>;

export default ViewTabBar;
