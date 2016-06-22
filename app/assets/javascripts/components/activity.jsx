var Activity = React.createClass({
  render: function() {
    return <div id="activities">
    Recent Activity
    {
      this.props.activities.map(function(activity) {
        return <div className="activity">
          <span className="date">{ dates.format_date(activity.date) }</span>
          <span className="at">@</span> 
          <span className="time">{ dates.format_time(activity.date) }</span> 
          <span className="user">{ activity.user }</span> 
          <span className="action" dangerouslySetInnerHTML={ { __html: marked(activity.action) } } /> 
          on 
          <MagmaLink link={activity.record_name} model={activity.model_name}/>
        </div>
      })
    }
    </div>
  }
})

module.exports = Activity
