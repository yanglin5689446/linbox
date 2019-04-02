
export default filter => threads => threads.map(thread => ({
  ...thread,
  messages: thread.messages
    .filter(message => filter(message.labelIds))
    .slice()
    .reverse(),
}))
  .filter(thread => thread.messages.length)
