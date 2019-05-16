
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const pushOrNew = (array, value, label) => {
  const last = array.length ? array[array.length - 1] : null
  if (!last || last.label !== label) {
    array.push({ label, threads: [value] })
  } else last.threads.push(value)
}

const categorize = (result, date, value) => {
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

const groupThreadsByDate = (cluster) => {
  const threads = []
  cluster.threads.forEach((thread) => {
    const date = dayjs(parseInt(thread.messages[0].internalDate, 10))
    categorize(threads, date, thread)
  })
  const result = { ...cluster, threads }
  return result
}

const groupByDate = (clusters) => {
  const result = []
  clusters.forEach((clusterOrThread) => {
    const cluster = clusterOrThread.id
      ? clusterOrThread
      : groupThreadsByDate(clusterOrThread)
    const internalDate = clusterOrThread.id
      ? clusterOrThread.messages[0].internalDate
      : clusterOrThread.threads[0].messages[0].internalDate
    const date = dayjs(parseInt(internalDate, 10))
    categorize(result, date, cluster)
  })
  return result
}

export default groupByDate
