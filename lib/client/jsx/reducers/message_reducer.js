var messageReducer = function(messages, action) {
  if (!messages) messages = []
  switch(action.type) {
    case 'SHOW_MESSAGES':
      return action.messages.concat([]);
    case 'DISMISS_MESSAGES':
      return [];
    default:
      return messages;
  }
}

module.exports = messageReducer
