
// thread are order by time desc by default,
// but messages are in opposite,
// so reverse messages orders first
// notice that this do a side effect to raw data,
// but IMO this order is more intuitive
export default filter => threads => threads.map(thread => ({
  ...thread,
  messages: thread.messages
    .filter(message => filter(message.labelIds))
    .slice()
    .reverse(),
}))
  .filter(thread => thread.messages.length)
