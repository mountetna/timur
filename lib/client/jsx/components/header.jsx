// Framework libraries.
import * as React from 'react';

class HeaderApprove extends React.Component{
  render(){
    let {handler} = this.props;
    return(
      <div className='inline' onClick={handler.bind(null, 'cancel')}>

        <div className='cancel' onClick={handler.bind(null,'cancel')}>

          <span className='far fa-times-circle' />
        </div>
        <div className='approve' onClick={handler.bind(null, 'approve')}>

          <span className='fas fa-check' />
        </div>
      </div>
    );
  }
}

class HeaderWaiting extends React.Component{
  render(){
    return(
      <div className='submit'>

        <span className='fas fa-spinner' />
      </div>
    );
  }
}

class HeaderEdit extends React.Component{
  render(){
    let {handler} = this.props;
    return(
      <div className='edit' onClick={handler.bind(null, 'edit')}>

        <span className='far fa-edit' />
      </div>
    );
  }
}

class HeaderClose extends React.Component{
  render(){
    let {handler} = this.props;
    return(
      <div className='close' onClick={handler.bind(null, 'close')}>

        <span className='far fa-times-circle' />
      </div>
    );
  }
}

class Header extends React.Component{
  render(){
    let {mode, handler, can_edit, can_close, children} = this.props;
    let elem = null;

    if(mode == 'edit'){
      elem = <HeaderApprove handler={handler} />;
    }
    else if(mode == 'submit'){
      elem = <HeaderWaiting />;
    }
    else if(can_edit){
      elem = <HeaderEdit handler = {handler} />
    }

    return(
      <div className='header'>

        {children}
        {elem}
        {can_close ? <HeaderClose handler={handler} /> : null}
      </div>
    );
  }
}

export default Header;
