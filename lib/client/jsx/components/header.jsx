// Framework libraries.
import * as React from 'react';

const headerButton = (className, onClick, icons) => (
  <div className={className} onClick={onClick}>
    <span className={`fa ${icons.map(icon => `fa-${icon}`).join('')}`} />
  </div>
)

class Header extends React.Component{
  render(){
    let {onApprove, onClose, onCancel, onEdit, onLoad, children} = this.props;

    return(
      <div className='header'>
        {children}
        {onEdit && headerButton('edit',onEdit, ['pencil-alt'])}
        {onCancel && headerButton('cancel',onCancel, ['ban'])}
        {onApprove && headerButton('approve',onApprove, ['check'])}
        {onClose && headerButton('close',onClose, ['times-circle'])}
        {onLoad && headerButton('load',null, ['spinner', 'pulse'])}
      </div>
    );
  }
}

export default Header;
