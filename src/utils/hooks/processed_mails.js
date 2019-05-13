
import { useContext } from 'react'
import MailsContext from 'context/mails'
import LabelsContext from 'context/labels'
import processThreads from 'utils/processThreads'
import filterThreadsByLabel from 'utils/filterThreadsByLabel'

const useProcessedMails = ({ includes = [], excludes = [] }) => {
  const { labels } = useContext(LabelsContext)
  const { mails } = useContext(MailsContext)
  const threads = filterThreadsByLabel(labelIds => labelIds.some(e => includes.includes(e))
    && !labelIds.some(e => excludes.includes(e)))(mails)

  return processThreads(threads, labels)
}

export default useProcessedMails
