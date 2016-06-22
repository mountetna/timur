var format_date = function(date) {
  if (!date) return null

  if (!(date instanceof Date)) date = new Date(date)

  return $.datepicker.formatDate( 'yy-mm-dd', date )
}

var format_time = function(date) {
  if (!date) return null

  if (!(date instanceof Date)) date = new Date(date)

  console.log(date)

  var hours = ('00' + date.getHours()).slice(-2);
  var minutes = ('00' + date.getMinutes()).slice(-2);
  return hours + ':' + minutes;
}

module.exports = {
  format_date: format_date,
  format_time: format_time
}
