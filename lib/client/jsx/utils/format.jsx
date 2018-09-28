/*
 * Change a timestamp in to a human readable format.
 */

export const dateFormat = (timestamp) => {
  if(timestamp == undefined || timestamp == null) return 'Unknown';

  let date = new Date(timestamp);
  let today = new Date();

  if (date.toDateString() == today.toDateString()) {
    let time = date.toLocaleString('en-us',{ hour: 'numeric', minute: 'numeric' });
    return `Today, ${time}`;
  } else {
    return date.toLocaleString('en-us', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

export const snakeCase = (str) => {
  return str.split(/(?=[A-Z])/).join('_').toLowerCase();
}

export const camelCase = (str) => {
  return str.toLowerCase().replace(
    /[^A-Za-z0-9]+([A-Za-z0-9])/g, 
    (_, chr) =>  chr.toUpperCase()
  );
}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
