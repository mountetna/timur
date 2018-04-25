/*
 * This component will render a 'loading' image to indicate to the user that
 * there are background requests in progress.
 *
 * There is an array in the Timur data store called 'loader_ui_stack'. When a
 * request is made an item is placed upon the stack. When a request completes
 * (or errors out) an item is removed from the stack.
 *
 * If there are no items on the stack then the loader graphic does not display.
 * If there is at least one item on the stack then the loader graphic will run.
 *
 * There are to Redux actions, 'POP_LOADER_STACK' and 'PUSH_LOADER_STACK', which
 * support this loader stack.
 *
 * The animation speed is set in the CSS.
 */

// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

export class LoaderUI extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      display: 'none',
      delay: 1000, // In milliseconds.
      timeout: null,
      self: this
    };
  }

  hideLoader(){
    this.setState({display: 'none'});
  }

  static getDerivedStateFromProps(next_props, prev_state){
    if(next_props.loader_ui_stack.length > 0){

      clearTimeout(prev_state.timeout);

      return{
        display: 'block',
        timeout: setTimeout(
          prev_state.self.hideLoader.bind(prev_state.self),
          prev_state.delay
        )
      };
    }

    return null;
  }

  render(){
    return(
      <div className='loader-ui-group' style={{display: this.state.display}}>

        <div className='loader-ui-background' />
        <div className='loader-graphic' />
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return {
    loader_ui_stack: state.timur.loader_ui_stack
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {};
};

export const LoaderUIContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(LoaderUI);
