
import URLSafeBase64 from 'urlsafe-base64'

const getNameAndMail = (value) => {
  if (!value) return { name: '', mail: '' }
  const delimiterIndex = value.lastIndexOf(' ')
  let name
  let mail
  if (delimiterIndex === -1) {
    mail = value[0] === '<'
      ? value.slice(1, value.length - 1)
      : value.slice(0, value.length)
    name = mail.split('@')[0] || mail
  } else {
    name = value[0] === '"'
      ? value.slice(1, delimiterIndex - 1)
      : value.slice(0, delimiterIndex)
    mail = value.slice(delimiterIndex + 2, value.length - 1)
  }
  return { name, mail }
}


const parseParts = ({
  parts, headers, filename, body, mimeType,
}) => {
  switch (mimeType) {
    case 'application/pdf':
    case 'image/jpeg': {
      const attachment = {
        name: filename,
        type: mimeType,
        id: body.attachmentId,
      }
      const cidHeader = headers.find(header => header.name === 'Content-ID')
      if (cidHeader) {
        const cidValue = cidHeader.value
        attachment.cid = cidValue.slice(1, cidValue.length - 1)
      }

      return { attachments: [attachment] }
    }
    case 'text/html': {
      const content = new TextDecoder().decode(URLSafeBase64.decode(body.data))
      return { content }
    }
    case 'text/plain': {
      const content = new TextDecoder().decode(URLSafeBase64.decode(body.data))
      return { content: `<pre>${content}</pre>` }
    }
    case 'multipart/alternative':
      return parseParts(parts[parts.length - 1])
    case 'multipart/related':
    case 'multipart/report':
    case 'multipart/mixed': {
      const mixed = parts.map(parseParts)
      return mixed.reduce((result, current) => ({
        content: result.content + (current.content || ''),
        attachments: result.attachments.concat(current.attachments || []),
      }), { content: '', attachments: [] })
    }
    default:
      return {}
  }
}

const parsePayload = ({ id, payload }) => {
  const findHeader = field => (payload.headers.find(e => e.name === field) || {}).value

  const from = getNameAndMail(findHeader('From'))
  const subject = findHeader('Subject') || ''

  try {
    const { content, attachments = [] } = parseParts(payload)
    return {
      from,
      subject,
      content,
      attachments,
    }
  } catch (e) {
    window.debug(`Message ID: ${id}`)
    window.debug(e)
    return {
      from, subject, content: `Parse failed for Message ${id}`, attachments: [],
    }
  }
}

export default parsePayload
