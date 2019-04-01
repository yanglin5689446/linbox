
import { useContext, useCallback } from 'react'

import UserContext from 'context/user'
import MailsContext from 'context/mails'
import useGoogleAPI from 'utils/hooks/google_api'

const useGmailAPI = () => {
  const { user } = useContext(UserContext)
  const { updateMails } = useContext(MailsContext)
  const { apiClient } = useGoogleAPI()
  const gmailApi = apiClient.gmail

  const initLoadInbox = useCallback(() => {
    const userId = user.emailAddresses[0].value
    gmailApi.users.threads.list({ userId })
      .then(({ result }) => Promise.all(
        result.threads.map(({ id }) => gmailApi.users.threads.get({ userId, id })),
      ))
      .then((responses) => {
        const threads = responses
          .map(({ result }) => result)
          .map(thread => ({
            ...thread,
            messages: thread.messages
              .filter(message => message.labelIds.includes('INBOX'))
              .slice()
              .reverse(),
          }))
          .filter(thread => thread.messages.length)
        updateMails({ div: 'inbox', threads })
      })
  })
  return { initLoadInbox }
}

export default useGmailAPI
