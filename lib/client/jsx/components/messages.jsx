// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import { dismissMessages } from '../actions/message_actions';
import markdown from '../utils/markdown';

const sanitize = (string) => string.replace(/</g,"&lt;").replace(/>/g,"&gt;");

class Messages extends React.Component{
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
  dismissMessages() {
    this.setState({ current_message: 0 });

    this.props.dismissMessages();
  }
  render() {
    let { messages } = this.props;
    let { current_message } = this.state;

    if (!messages.length) return <div></div>;

    let nav;

    if (messages.length > 1) {
      nav = <div id="nav">
        {
          current_message ?  <span className="arrow fas fa-chevron-left" onClick={ this.prevMessage.bind(this) }/> : null
        }
        <span className="pager">
          Page { current_message + 1 } of { messages.length }
        </span>
        {
          current_message < messages.length-1 ?  <span className="arrow fas fa-chevron-right" onClick={ this.nextMessage.bind(this) }/> : null
        }
      </div>
    }

    let message = markdown( sanitize( messages[current_message] ) );

    return <div id="messages">
            <div id="quote">
              <svg width="31" height="40">
                <path d="M 2,40 20,25 18,40"/>
              </svg>
            </div>
            <div id="dismiss" onClick={ this.dismissMessages.bind(this) }>
              <span className="fas fa-check"> </span>
            </div>
            <div id="message_viewer">
              { nav }
              <div id="message"
                dangerouslySetInnerHTML={ { __html: message } }/>
            </div>
          </div>;
  }
}


export default connect(
 ({messages})=>({messages}),
 { dismissMessages }
)(Messages);
