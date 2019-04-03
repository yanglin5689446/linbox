
import { useContext, useCallback } from 'react'
import URLSafeBase64 from 'urlsafe-base64'

import UserContext from 'context/user'
import MailsContext from 'context/mails'
import DraftsContext from 'context/drafts'
import useGoogleAPI from 'utils/hooks/google_api'
import compose from 'utils/compose'
import rfc5322 from 'utils/rfc5322'

const encodeDraft = compose(
  URLSafeBase64.encode,
  Buffer.from,
  rfc5322,
)

const useGmailAPI = () => {
  const { user } = useContext(UserContext)
  const { updateMails } = useContext(MailsContext)
  const { newDraftEdit, updateDraftEdit, closeDraftEdit } = useContext(DraftsContext)
  const { apiClient } = useGoogleAPI()
  const gmailApi = apiClient.gmail

  const loadMails = useCallback(() => {
    const userId = user.emailAddresses[0].value
    gmailApi.users.threads.list({ userId })
      .then(({ result }) => Promise.all(
        result.threads.map(({ id }) => gmailApi.users.threads.get({ userId, id })),
      ))
      .then((responses) => {
        const threads = responses.map(({ result }) => result)
        updateMails({ raw: threads })
      })
  }, [])
  const createDraft = useCallback((draft) => {
    const userId = user.emailAddresses[0].value
    gmailApi.users.drafts.create({ userId, message: { raw: draft.content } })
      .then(({ result }) => newDraftEdit({
        id: result.id,
        sender: userId,
        ...draft,
      }))
  }, [])
  const updateDraft = useCallback(async (draft) => {
    const userId = user.emailAddresses[0].value
    updateDraftEdit(draft)
    await gmailApi.users.drafts.update({
      id: draft.id,
      userId,
      message: { raw: encodeDraft(draft) },
    })
  }, [])
  const sendDraft = useCallback((id) => {
    const userId = user.emailAddresses[0].value
    gmailApi.users.drafts.send({ id, userId })
      .then(() => closeDraftEdit(id))
  })
  const deleteDraft = useCallback((id) => {
    const userId = user.emailAddresses[0].value
    gmailApi.users.drafts.delete({ id, userId })
      .then(() => closeDraftEdit(id))
  })
  return {
    loadMails, createDraft, updateDraft, sendDraft, deleteDraft,
  }
}

export default useGmailAPI
