var messageActions = {
  showMessages: function(messages) {
    return {
      type: 'SHOW_MESSAGES',
      messages: messages
    }
  },
  dismissMessages: function() {
    return {
      type: 'DISMISS_MESSAGES'
    }
  }
}

module.exports = messageActions;
