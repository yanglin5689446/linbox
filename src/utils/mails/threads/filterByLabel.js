
export default ({ includes, excludes }) => threads => threads.map(thread => ({
  ...thread,
  messages: thread.messages
    .filter(message => (includes ? message.labelIds.some(e => includes.includes(e)) : true))
    .filter(message => (excludes ? !message.labelIds.some(e => excludes.includes(e)) : true)),
}))
  .filter(thread => thread.messages.length)
