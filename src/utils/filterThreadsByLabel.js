
export default label => threads => threads.map(thread => ({
  ...thread,
  messages: thread.messages
    .filter(message => message.labelIds.includes(label))
    .slice()
    .reverse(),
}))
  .filter(thread => thread.messages.length)
