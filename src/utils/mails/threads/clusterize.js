// clusterize threads by same label
// threads with same label are clusterized to one cluster,
// threads with personal lable are not included.
// so the return type is [(cluster | thread)]
const clusterize = labels => (threads) => {
  const result = []
  threads.forEach((thread) => {
    const latestMessage = thread.messages[0]
    const foundLabel = labels.user.find(e => latestMessage.labelIds.includes(e.id))
      || labels.category.find(e => latestMessage.labelIds.includes(e.id))
    if (foundLabel) {
      const index = result.findIndex(e => e.labelIds && e.labelIds.includes(foundLabel.id))
      if (index === -1) {
        result.push({ labelIds: latestMessage.labelIds, threads: [thread] })
      } else {
        result[index].threads.push(thread)
      }
    } else if (latestMessage.labelIds.includes('CATEGORY_PERSONAL')) {
      result.push(thread)
    }
  })
  return result
}

export default clusterize
