// Framework libraries.
import * as React from 'react';
import ButtonBar, { buttonsWithCallbacks } from './button_bar';

const headerButton = (className, onClick, icons) => (
  <div className={className} onClick={onClick}>
    <span className={`fa ${icons.map(icon => `fa-${icon}`).join('')}`} />
  </div>
)

class Header extends React.Component{
  render(){
    let {children} = this.props;

    let buttons = buttonsWithCallbacks([
        'cancel',
        'edit',
        'save',
        'load'
      ],
      this.props
    );

    return(
      <div className='header'>
        {children}

        <ButtonBar className='buttons' buttons={buttons}/>
      </div>
    );
  }
}

export default Header;
