export const formatDate = (date) => {
  if (!date) return null

  if (!(date instanceof Date)) date = new Date(date)

  return $.datepicker.formatDate( 'yy-mm-dd', date )
}

export const formatTime = (date) => {
  if (!date) return null

  if (!(date instanceof Date)) date = new Date(date)


  let hours = ('00' + date.getHours()).slice(-2);
  let minutes = ('00' + date.getMinutes()).slice(-2);
  return hours + ':' + minutes;
}
