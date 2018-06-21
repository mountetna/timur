import * as React from 'react';
import {manifestResult} from './manifest_result';

export default class ConsignmentView extends React.Component {
  render() {
    let { consignment } = this.props;

    if (!consignment) return null;

    return <div className='consignment-view'>
      <div className='label'>Results:</div>
      {
        Object.keys(consignment).map(
          (name,i) => {
            if (consignment[name] == 'macro') return null;
            return <div key={i} className='consignment-result'>
              <div className='consignment-variable-name'>@{name}:</div>
              {manifestResult(name, consignment[name])}
            </div>
          }
        ).filter(_=>_)
      }
    </div>
  }
}
