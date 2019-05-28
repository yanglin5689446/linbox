
import { useContext, useCallback } from 'react'
import MailsContext from 'context/mails'
import LabelsContext from 'context/labels'
import compose from 'utils/compose'
import filterByLabel from 'utils/mails/threads/filterByLabel'
import markPrimaryLabel from 'utils/mails/threads/markPrimaryLabel'
import extract from 'utils/mails/threads/extract'
import classify from 'utils/mails/threads/classify'
import groupByDate from 'utils/mails/threads/groupByDate'

const map = func => array => array.map(func)

const useProcessedMails = ({
  includes, excludes, aggregate = true, sent = false,
}) => {
  const { labels } = useContext(LabelsContext)
  const { mails } = useContext(MailsContext)

  const final = aggregate
    ? compose(groupByDate, classify(labels))
    : self => self
  const process = useCallback(compose(
    final,
    map(markPrimaryLabel(labels, sent)),
    filterByLabel({ includes, excludes }),
    map(extract),
  ), [mails])


  return process(mails)
}

export default useProcessedMails
