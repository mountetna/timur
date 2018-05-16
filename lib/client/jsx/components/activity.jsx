// Framework libraries.
import * as React from 'react';

import * as Dates from '../utils/dates';
import MagmaLink from './magma_link';
import markdown from '../utils/markdown';

export default class Activity extends React.Component{
  render() {
    return <div id="activities">
    Recent Activity
    {
      this.props.activities.map(function(activity) {
        return <div className="activity">
          <span className="date">{ Dates.formatDate(activity.date) }</span>
          <span className="at">@</span> 
          <span className="time">{ Dates.formatTime(activity.date) }</span> 
          <span className="user">{ activity.user }</span> 
          <span className="action" dangerouslySetInnerHTML={ { __html: markdown(activity.action) } } /> 
          on 
          <MagmaLink link={activity.record_name} model={activity.model_name}/>
        </div>
      })
    }
    </div>
  }
}
