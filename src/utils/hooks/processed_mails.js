
import { useContext, useCallback } from 'react'
import MailsContext from 'context/mails'
import LabelsContext from 'context/labels'
import compose from 'utils/compose'
import filterByLabel from 'utils/mails/threads/filterByLabel'
import extract from 'utils/mails/threads/extract'
import clusterize from 'utils/mails/threads/clusterize'
import groupClustersByDate from 'utils/mails/threads/groupClustersByDate'

const reverseMessagesOrder = thread => ({
  ...thread,
  messages: thread.messages.slice().reverse(),
})

const map = func => array => array.map(func)

const useProcessedMails = ({ includes, excludes }) => {
  const { labels } = useContext(LabelsContext)
  const { mails } = useContext(MailsContext)
  const process = useCallback(compose(
    groupClustersByDate,
    clusterize(labels),
    map(reverseMessagesOrder),
    filterByLabel({ includes, excludes }),
    map(extract),
  ), [mails])
  return process(mails)
}

export default useProcessedMails
