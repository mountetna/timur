import { reviseDocument } from '../../actions/magma_actions'

var DateTimeView = React.createClass({
  render: function() {
    var self = this
    if (this.props.mode == "edit") {
      return <div className="value">
              <input placeholder="YYYY-MM-DD" 
                  type='text'
                  className="date_text" 
                  id={ this.component_name('date') }
                  defaultValue={ dates.format_date(this.props.revision) }/>
              <span className="at_spacer">@</span>
              <input 
                placeholder="00:00"
                type='text'
                className="time_text"
                id={ this.component_name('time') } 
                defaultValue={ dates.format_time(this.props.revision) }
                onChange={
                  function (e) {
                      self.setState({ changed_time: e.target.value },function() {
                        self.props.reviseDateTime( self.changed_date_time() )
                      })
                  }
                }/>
             </div>
    }
    return <div className="value">
            { dates.format_date(this.props.value) || '?' }
            <span className="at_spacer">@</span>
            { dates.format_time(this.props.value) || '?' }
           </div>
  },
  componentDidUpdate: function () {
    var dateInput = "input[type=text][id='" + this.component_name('date') + "']"
    var timeInput = "input[type=text][id='" + this.component_name('time') + "']"
    var self = this

    $(dateInput).datepicker({
      defaultDate: dates.format_date(this.props.value),
      dateFormat: 'yy-mm-dd',
      onClose: function(date) {
        self.setState({ changed_date: date }, function() {
          self.props.reviseDateTime( self.changed_date_time() )
        })
      },
      changeYear: true,
      changeMonth: true,
      showButtonPanel: true
    })
    $(timeInput).mask('00:00')
  },

  component_name: function(type) { return type + this.props.attribute.name },


  changed_date_time: function() {
    var date = this.state.changed_date || dates.format_date(this.props.revision)
    var time = this.state.changed_time || dates.format_time(this.props.revision)

    // this signals that we want to empty the field
    if (!this.state.changed_date && !this.state.changed_time && this.props.revision) return -1

    // this signals that we don't have enough info
    if (!date || !time || time.length != 5) return null

    var pieces = date.split(/-/).concat(time.split(/:/))

    return new Date(pieces[0], parseInt(pieces[1])-1, pieces[2], pieces[3], pieces[4])
  }
})

var DateTimeAttribute = connect(
  null,
  function(dispatch,props) {
    return {
      reviseDateTime: function(changed_date) {
        var old_date = new Date(props.revision)

        if (changed_date 
            && (changed_date == -1 
            || old_date.getTime() != changed_date.getTime())) {
          dispatch(
            reviseDocument(
              props.document,
              props.template,
              props.attribute,
              changed_date == -1 ? null : changed_date.toISOString()
            )
          )
        }
      }
    }
  }
)(DateTimeView)

DateTimeAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = DateTimeAttribute
