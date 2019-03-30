
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import compose from 'utils/compose'
import debug from 'utils/debug'

dayjs.extend(relativeTime)

const clusters = [
  'CATEGORY_SOCIAL',
  'CATEGORY_PROMOTION',
  'CATEGORY_FORUMS',
  'CATEGORY_UPDATES',
  'CATEGORY_FINANTIAL',
]
const personal = 'CATEGORY_PERSONAL'

// clusterize threads by same label
// threads with same label are clusterized to one cluster,
// threads with personal lable are not included.
// so the return type is [(cluster | thread)]
// @todo: inlcudes user defined cluster
const clusterize = (threads) => {
  const result = []
  threads.forEach((thread) => {
    // thread are order by time desc by default,
    // but messages are in opposite,
    // so reverse messages orders first
    // notice that this do a side effect to raw data,
    // but IMO this order is more intuitive
    thread.messages.reverse()

    const found = clusters.find(e => thread.messages[0].labelIds.includes(e))
    if (found) {
      const index = result.findIndex(e => e.labelIds && e.labelIds.includes(found))
      if (index === -1) {
        result.push({ labelIds: thread.messages[0].labelIds, threads: [thread] })
      } else {
        result[index].threads.push(thread)
      }
    } else if (thread.messages[0].labelIds.includes(personal)) {
      result.push(thread)
    }
  })
  return result
}

const pushOrNew = (array, value, label) => {
  const last = array.length ? array[array.length - 1] : null
  if (!last || last.label !== label) {
    array.push({ label, threads: [value] })
  } else last.threads.push(value)
}

const categorizeByDate = (result, date, value) => {
  if (date > dayjs().startOf('day')) {
    pushOrNew(result, value, 'today')
  } else if (date > dayjs().startOf('day').subtract(1, 'day')) {
    pushOrNew(result, value, 'yesterday')
  } else if (date > dayjs().startOf('month') && date > dayjs().startOf('year')) {
    pushOrNew(result, value, 'this_month')
  } else {
    pushOrNew(result, value, date.format('YYYY/MM'))
  }
}

const categorizeClusterByDate = (cluster) => {
  const threads = []
  cluster.threads.forEach((thread) => {
    const date = dayjs(parseInt(thread.messages[0].internalDate, 10))
    categorizeByDate(threads, date, thread)
  })
  const result = { ...cluster, threads }
  return result
}

const categorizeClusterizedByDate = (clusterized) => {
  const result = []
  clusterized.forEach((clusterOrThread) => {
    const cluster = clusterOrThread.id
      ? clusterOrThread
      : categorizeClusterByDate(clusterOrThread)
    const internalDate = clusterOrThread.id
      ? clusterOrThread.messages[0].internalDate
      : clusterOrThread.threads[0].messages[0].internalDate
    const date = dayjs(parseInt(internalDate, 10))
    categorizeByDate(result, date, cluster)
  })
  return result
}

const processThreads = compose(
  debug,
  categorizeClusterizedByDate,
  clusterize,
)

export default processThreads
