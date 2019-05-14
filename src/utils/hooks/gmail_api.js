
import { useContext, useCallback } from 'react'

import UserContext from 'context/user'
import MailsContext from 'context/mails'
import DraftsContext from 'context/drafts'
import LabelsContext from 'context/labels'
import useGoogleAPI from 'utils/hooks/google_api'
import encode from 'utils/mails/encode'

const useGmailAPI = () => {
  const { user } = useContext(UserContext)
  const { setMails } = useContext(MailsContext)
  const { updateLabels } = useContext(LabelsContext)
  const {
    newDraftEdit, updateDraftEdit, closeDraftEdit, updateDrafts,
  } = useContext(DraftsContext)
  const { apiClient } = useGoogleAPI()
  const gmailApi = apiClient.gmail

  const getLabels = useCallback(() => {
    const userId = user.emailAddresses[0].value
    gmailApi.users.labels.list({ userId })
      .then(({ result }) => {
        const systemAll = result.labels.filter(label => label.type === 'system')
        const category = systemAll
          .filter(label => label.id.startsWith('CATEGORY') && !label.id.endsWith('PERSONAL'))
        const system = result.labels.filter(label => label.type === 'system')
          .filter(label => !label.id.startsWith('CATEGORY') || label.id.endsWith('PERSONAL'))
        const userLabels = result.labels.filter(label => label.type === 'user')

        const labels = {
          category,
          system,
          user: userLabels,
        }
        updateLabels(labels)
      })
  })

  const loadMails = useCallback(() => {
    const userId = user.emailAddresses[0].value
    gmailApi.users.threads.list({ userId })
      .then(({ result }) => Promise.all(
        result.threads.map(({ id }) => gmailApi.users.threads.get({ userId, id })),
      ))
      .then((responses) => {
        const threads = responses.map(({ result }) => result)
        setMails(threads)
      })
  }, [])

  const loadDrafts = useCallback(() => {
    const userId = user.emailAddresses[0].value
    gmailApi.users.drafts.list({ userId })
      .then(({ result }) => Promise.all(
        result.drafts.map(({ id }) => gmailApi.users.drafts.get({ userId, id })),
      ))
      .then((responses) => {
        const drafts = responses.map(({ result }) => result)
          .reduce((accum, current) => ({ ...accum, [current.id]: current }), {})
        updateDrafts(drafts)
      })
  }, [])

  const trashDraft = useCallback((id) => {
    const userId = user.emailAddresses[0].value
    // @todo: optimize this so that it won't reload after every deletion
    gmailApi.users.threads.trash({ userId, id }).then(loadDrafts)
  }, [])
  const trashMessage = useCallback((id) => {
    const userId = user.emailAddresses[0].value
    // @todo: optimize this so that it won't reload after every deletion
    gmailApi.users.messages.trash({ userId, id }).then(loadMails)
  }, [])
  const trashThread = useCallback((id) => {
    const userId = user.emailAddresses[0].value
    // @todo: optimize this so that it won't reload after every deletion
    gmailApi.users.threads.trash({ userId, id }).then(loadMails)
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
      message: { raw: encode(draft) },
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
    loadMails,
    getLabels,
    trashDraft,
    trashThread,
    trashMessage,
    loadDrafts,
    createDraft,
    updateDraft,
    sendDraft,
    deleteDraft,
  }
}

export default useGmailAPI
