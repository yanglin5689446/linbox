
// classify threads by same label
// threads with same label are classified to one cluster,
// threads with personal label are not included.
// so the return type is [(cluster | thread)]

// in order to maintain time order it's not eligible to reduce thread to object directly,
// since object keys are not sorted.

const classify = labels => (threads) => {
  const result = []
  threads.forEach((thread) => {
    if (labels.category.includes(thread.primaryLabel)) {
      const index = result.findIndex(e => e.primaryLabel && e.primaryLabel === thread.primaryLabel)
      if (index === -1) {
        result.push({ primaryLabel: thread.primaryLabel, threads: [thread] })
      } else {
        result[index].threads.push(thread)
      }
    } else if (thread.primaryLabel === labels.personal) {
      result.push(thread)
    }
  })
  return result
}

export default classify
