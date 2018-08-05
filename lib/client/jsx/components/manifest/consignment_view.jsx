import * as React from 'react';
import ConsignmentResult from './consignment_result';

export default class ConsignmentView extends React.Component {
  render() {
    let { consignment } = this.props;

    if (!consignment) return null;

    return <div className='consignment-view'>
      <div className='consignment-view-label'>Results:</div>
      {
        Object.keys(consignment).map(
          (name,i) =>
            <div key={i} className='consignment-variable-group'>
              <div className='consignment-variable-name'>@{name}:</div>
              <ConsignmentResult name={name} data={consignment[name]}/>
            </div>
        )
      }
    </div>
  }
}
