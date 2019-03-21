import * as React from 'react';
import { connect } from 'react-redux';
import ConsignmentResult from './consignment_result';
import { selectConsignment } from '../../selectors/consignment_selector';

class ConsignmentView extends React.Component {
  render() {
    let { consignment } = this.props;

    if (!consignment) return null;

    return <div className='consignment-view'>
      <div className='consignment-view-label'>Results:</div>
      {
        Object.keys(consignment).map(
          (name,i) =>
            <div key={i} className='consignment-variable-group'>
              <div className='consignment-variable-name'>{name}</div>
              <div className='consignment-variable-result'>
                <ConsignmentResult name={name} data={consignment[name]}/>
              </div>
            </div>
        )
      }
    </div>
  }
}

export default connect(
  (state, {md5sum}) => ({
    consignment: md5sum && selectConsignment(state, md5sum)
  })
)(ConsignmentView);
