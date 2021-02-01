// Framework libraries.
import * as React from 'react';
import ButtonBar, { buttonsWithCallbacks } from 'etna-js/components/button_bar';

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
