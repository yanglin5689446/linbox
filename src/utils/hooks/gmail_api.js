
import { useContext, useCallback } from 'react'

import UserContext from 'context/user'
import MailsContext from 'context/mails'
import DraftsContext from 'context/drafts'
import LabelsContext from 'context/labels'
import useGoogleAPI from 'utils/hooks/google_api'
import encode from 'utils/mails/encode'

const useGmailAPI = () => {
  const { user } = useContext(UserContext)
  const { removeMessage, removeThread, setMails } = useContext(MailsContext)
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
          .filter(label => label.id.startsWith('CATEGORY'))
          .filter(label => !label.id.endsWith('PERSONAL'))
        const system = systemAll.filter(label => !label.id.startsWith('CATEGORY'))
        const userLabels = result.labels.filter(label => label.type === 'user')
        const personal = systemAll.find(label => label.id === 'CATEGORY_PERSONAL')

        const labels = {
          category,
          system,
          personal,
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

  const modifyMessage = useCallback(({ id, add, remove }) => {
    const userId = user.emailAddresses[0].value
    gmailApi.users.messages
      .modify({
        id, userId, addLabelIds: add, removeLabelIds: remove,
      })
      .execute()
  }, [])

  const batchModifyMessages = useCallback(({ ids, add, remove }) => {
    const userId = user.emailAddresses[0].value
    gmailApi.users.messages
      .batchModify({
        ids, userId, addLabelIds: add, removeLabelIds: remove,
      })
      .execute()
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
    removeThread(id)
    gmailApi.users.threads.trash({ userId, id })
  }, [])
  const trashMessage = useCallback(({ id, threadId }) => {
    const userId = user.emailAddresses[0].value
    removeMessage({ id, threadId })
    gmailApi.users.messages.trash({ userId, id }).then(loadMails)
  }, [])
  const trashThread = useCallback((id) => {
    const userId = user.emailAddresses[0].value
    removeThread(id)
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
    modifyMessage,
    batchModifyMessages,
    loadDrafts,
    createDraft,
    updateDraft,
    sendDraft,
    deleteDraft,
  }
}

export default useGmailAPI
