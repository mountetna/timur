export const showMessages = (messages) => ({
  type: 'SHOW_MESSAGES',
  messages: messages
});

export const dismissMessages = () => ({
  type: 'DISMISS_MESSAGES'
});
