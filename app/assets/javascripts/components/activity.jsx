import markdown from '../markdown'
import { formatDate, formatTime } from '../utils/dates';

var Activity = React.createClass({
  render: function() {
    return <div id="activities">
    Recent Activity
    {
      this.props.activities.map(function(activity) {
        return <div className="activity">
          <span className="date">{ formatDate(activity.date) }</span>
          <span className="at">@</span> 
          <span className="time">{ formatTime(activity.date) }</span> 
          <span className="user">{ activity.user }</span> 
          <span className="action" dangerouslySetInnerHTML={ { __html: markdown(activity.action) } } /> 
          on 
          <MagmaLink link={activity.record_name} model={activity.model_name}/>
        </div>
      })
    }
    </div>
  }
})

module.exports = Activity
