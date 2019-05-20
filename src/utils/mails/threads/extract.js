import parsePayload from 'utils/mails/parsePayload'

export default ({ id, messages }) => ({
  id,
  messages: messages
    .map(message => ({
      id: message.id,
      threadId: message.threadId,
      internalDate: message.internalDate,
      snippet: message.snippet,
      labelIds: message.labelIds,
      unread: message.labelIds.includes('UNREAD'),
      ...parsePayload(message),
    })),
  hasUnread: messages
    .map(({ labelIds }) => labelIds)
    .some(ids => ids.includes('UNREAD')),
})
