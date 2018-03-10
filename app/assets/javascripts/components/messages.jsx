// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as MessageActions from '../actions/message_actions';
import markdown from '../markdown';

export class Messages extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      current_message: 0
    };
  }

  prevMessage() {
    var new_message = this.state.current_message - 1;
    if (new_message < 0) return;
    this.setState({ current_message: new_message });
  }
  nextMessage() {
    var new_message = this.state.current_message + 1;
    if (new_message >= this.props.messages.length) return;
    this.setState({ current_message: new_message });
  }
  sanitize(string) {
    return string.replace(/</g,"&lt;").replace(/>/g,"&gt;")
  }
  render() {
    var self = this;
    if (!this.props.messages.length) return <div></div>;

    var nav;

    if (this.props.messages.length > 1) {
      nav = <div id="nav">
        {
          this.state.current_message ?  <span className="arrow fa fa-chevron-left" onClick={ this.prevMessage }/> : null
        }
        <span className="pager">
          Page { this.state.current_message + 1 } of { this.props.messages.length }
        </span>
        {
          this.state.current_message < this.props.messages.length-1 ?  <span className="arrow fa fa-chevron-right" onClick={ this.nextMessage }/> : null
        }
      </div>
    }

    var message = markdown(
      this.sanitize(
        this.props.messages[this.state.current_message]
      )
    );

    return <div id="messages">
            <div id="quote">
              <svg width="31" height="20">
                <path d="M 8,20 0,0 20,20"/>
              </svg>
            </div>
            <div id="dismiss"
               onClick={ function() { 
                 self.setState({ current_message: 0 });
                 self.props.dispatch(MessageActions.dismissMessages())
               } }>
              <span className="fa fa-check"> </span>
            </div>
            <div id="message_viewer">
              { nav }
              <div id="message"
                dangerouslySetInnerHTML={ { __html: message } }/>
            </div>
          </div>;
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return {
    messages: state.messages
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {};
};

export const MessagesContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
