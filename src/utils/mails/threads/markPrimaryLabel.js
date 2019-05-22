
export default (labels, sent) => (thread) => {
  const { messages } = thread
  const selectedMessage = sent
    ? messages[0]
    : messages.find(message => !message.labelIds.includes('SENT')) || messages[0]
  const matchedLabel = label => selectedMessage.labelIds.includes(label.id)
  const isPersonal = selectedMessage.labelIds.includes(labels.personal.id) && labels.personal
  return {
    ...thread,
    primaryLabel: labels.user.find(matchedLabel)
      || labels.category.find(matchedLabel)
      || isPersonal
      || labels.system.find(matchedLabel),
  }
}
