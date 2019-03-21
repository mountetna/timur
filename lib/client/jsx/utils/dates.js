const pad = (v) => ('00' + v).slice(-2);

export const formatDate = (date)=>{
  if(!date) return null;
  if(!(date instanceof Date)) date = new Date(date);

  let day = pad(date.getDate());
  let month = pad(date.getMonth()+1);
  let year = pad(date.getFullYear());

  return `${month}-${day}-${year}`;
};

export const formatTime = (date)=>{
  if(!date) return null;
  if(!(date instanceof Date)) date = new Date(date);
  let hours = pad(date.getHours());
  let minutes = pad(date.getMinutes());
  return `${hours}:${minutes}`;
};
