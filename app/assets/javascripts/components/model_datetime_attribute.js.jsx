DateTimeAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    
    return <div className="value">
            { this.default_date() || '?' }
            <span className="at_spacer">@</span>
            { this.default_time() || '?' }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <input placeholder="YYYY-MM-DD" type='text' className="date_text" id={ this.component_name('date') } defaultValue={ this.default_date() }/>
            <span className="at_spacer">@</span>
            <input placeholder="00:00" type='text' className="time_text" id={ this.component_name('time') } defaultValue={ this.default_time() } onChange={this.change_time}/>
           </div>
  },

  component_name: function(type) { return type + this.props.attribute.name },

  date_format: 'yy-mm-dd',

  default_date: function() {
    var base = this.props.record[this.props.attribute.name];
    if (!base) return null;
    return $.datepicker.formatDate( this.date_format, new Date(base));
  },
  default_time: function() {
    var base = this.props.record[this.props.attribute.name];
    if (!base) return null;
    var date = new Date(base);
    var hours = ('00' + date.getHours()).slice(-2);
    var minutes = ('00' + date.getMinutes()).slice(-2);
    return hours + ':' + minutes;
  },
  current_date_string: function() {
    var date = this.current_date || this.default_date();
    var time = this.current_time || this.default_time();
    if (!time || time.length != 5) return null;
    var pieces = date.split(/-/).concat(time.split(/:/));
    console.log(pieces);
    date = new Date(pieces[0], parseInt(pieces[1])-1, pieces[2], pieces[3], pieces[4])
    return date.toISOString();
  },
  form_update: function() {
    var date = this.current_date_string();
    if (date) {
      this.props.process(
          'form-token-update', 
          { name: this.value_name(), value: date }
      );
    }
  },
  change_date: function() {
    var self = this;
    return function(date,picker) {
      if (date != picker.lastVal) self.current_date = this.value;
      self.form_update();
    }
  },
  change_time: function (e) {
      this.current_time = e.target.value;
      this.form_update();
  },
  componentDidUpdate: function () {
    var minDate = new Date('2014-06-01');
    var dateInput = "input[type=text][id='" + this.component_name('date') + "']"
    var timeInput = "input[type=text][id='" + this.component_name('time') + "']"

    $(dateInput).datepicker({
      defaultDate: this.default_date(),
      dateFormat: this.date_format,
      onClose: this.change_date(),
      changeYear: true,
      changeMonth: true,
      showButtonPanel: true
    });
    $(timeInput).mask('00:00');
  }
});
