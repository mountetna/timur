import * as React from 'react';
import {connect} from 'react-redux';
import { pushLocation } from '../actions/location_actions';

class Link extends React.Component {
  pushLocation(event) {
    let { children, link, pushLocation } = this.props;

    event.preventDefault();
    pushLocation(link);
  }

  render() {
    let { children, link } = this.props;
    return <a
      className='link'
      onClick={ link.match(/^https?:\/\//) ? null : this.pushLocation.bind(this) }
      href={ link } >
      {children}
    </a>
  }
}

export default connect(
  null,
  { pushLocation }
)(Link);
