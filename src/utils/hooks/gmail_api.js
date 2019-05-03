
import { useContext, useCallback } from 'react'
import URLSafeBase64 from 'urlsafe-base64'

import UserContext from 'context/user'
import MailsContext from 'context/mails'
import DraftsContext from 'context/drafts'
import LabelsContext from 'context/labels'
import useGoogleAPI from 'utils/hooks/google_api'
import compose from 'utils/compose'
import rfc5322 from 'utils/rfc5322'

const encodeDraft = compose(
  URLSafeBase64.encode,
  Buffer.from,
  rfc5322,
)

const parsePayload = ({
  headers, body, mimeType, parts,
}) => {
  const getNameAndMail = (value) => {
    if (!value) return { name: '', mail: '' }
    const mailRegex = /([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)/g
    const mail = value.match(mailRegex)[0] || ''
    const name = value.replace(mail, '').replace(' <>', '').replace(/"/g, '') || ''
    return { name, mail }
  }
  const findHeader = field => (headers.find(e => e.name === field) || {}).value
  const from = getNameAndMail(findHeader('From'))
  const subject = findHeader('Subject') || ''

  const info = { from, subject }
  switch (mimeType) {
    case 'text/plain': {
      const parsed = new TextDecoder().decode(URLSafeBase64.decode(body.data))
      return { content: `<pre>${parsed}</pre>`, ...info }
    }
    case 'text/html': {
      const parsed = new TextDecoder().decode(URLSafeBase64.decode(body.data))
      return { content: parsed, ...info }
    }
    case 'multipart/alternative': {
      const htmlPart = parts.find(part => part.mimeType === 'text/html')
      const textPart = parts.find(part => part.mimeType === 'text/plain')
      const p = (htmlPart || textPart)
      const parsed = new TextDecoder().decode(URLSafeBase64.decode(p.body.data))
      return { content: parsed, ...info }
    }
    case 'multipart/mixed': {
      const plainTextPart = parts.find(part => part.mimeType === 'text/html')
      const htmlPart = parts.find(part => part.mimeType === 'text/html')
      const alternativePart = parts.find(part => part.mimeType === 'multipart/alternative')
      let parsed
      if (plainTextPart) {
        parsed = new TextDecoder().decode(URLSafeBase64.decode(plainTextPart.body.data))
        parsed = `<pre>${parsed}</pre>`
      } else if (htmlPart) {
        parsed = new TextDecoder().decode(URLSafeBase64.decode(htmlPart.body.data))
      } else if (alternativePart) {
        const contentPart = alternativePart.parts.find(part => part.mimeType === 'text/html')
        parsed = new TextDecoder().decode(URLSafeBase64.decode(contentPart.body.data))
      }
      return { content: parsed, ...info }
    }
    default:
      return info
  }
}

const useGmailAPI = () => {
  const { user } = useContext(UserContext)
  const { updateMails } = useContext(MailsContext)
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
        const threads = responses
          .map(({ result }) => result)
          .map(thread => ({
            ...thread,
            messages: thread.messages.map(message => ({
              id: message.id,
              internalDate: message.internalDate,
              snippet: message.snippet,
              labelIds: message.labelIds,
              threadId: message.threadId,
              ...parsePayload(message.payload),
            })),
          }))

        updateMails({ raw: threads })
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
