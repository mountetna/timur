import * as React from 'react';
import {connect} from 'react-redux';
import { pushLocation } from '../actions/location_actions';

class Link extends React.Component {
  render() {
    let { name, link, pushLocation } = this.props;
    return <a
      className='link'
      onClick={
        (event) => {
          event.preventDefault();
          pushLocation(link);
        }
      }
      href={ link } >
      {name}
    </a>
  }
}

export default connect(
  null,
  { pushLocation }
)(Link);
