
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import compose from 'utils/compose'
import { labels, personal } from 'constants/system_labels'

dayjs.extend(relativeTime)

// clusterize threads by same label
// threads with same label are clusterized to one cluster,
// threads with personal lable are not included.
// so the return type is [(cluster | thread)]
// @todo: inlcudes user defined cluster
const clusterize = (threads) => {
  const result = []
  threads.forEach((thread) => {
    const found = labels.find(e => thread.messages[0].labelIds.includes(e))
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
    pushOrNew(result, value, 'TODAY')
  } else if (date > dayjs().startOf('day').subtract(1, 'day')) {
    pushOrNew(result, value, 'YESTERDAY')
  } else if (date > dayjs().startOf('month') && date > dayjs().startOf('year')) {
    pushOrNew(result, value, 'THIS_MONTH')
  } else if (date > dayjs().startOf('year')) {
    pushOrNew(result, value, 'MONTH')
    // eslint-disable-next-line
    result[result.length - 1].date = { month: date.month() + 1 }
  } else if (date > dayjs().subtract(1, 'year').startOf('year')) {
    pushOrNew(result, value, 'YEAR_N_MONTH')
    // eslint-disable-next-line
    result[result.length - 1].date = { year: date.year(), month: date.month() + 1 }
  } else {
    pushOrNew(result, value, 'EARLIER')
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
  categorizeClusterizedByDate,
  clusterize,
)

export default processThreads
