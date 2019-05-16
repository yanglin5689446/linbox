
export default labels => (thread) => {
  const matchedLabel = label => thread.messages[0].labelIds.includes(label.id)
  const isPersonal = thread.messages[0].labelIds.includes(labels.personal.id) && labels.personal
  return {
    ...thread,
    primaryLabel: labels.user.find(matchedLabel)
      || labels.category.find(matchedLabel)
      || isPersonal
      || labels.system.find(matchedLabel),
  }
}
