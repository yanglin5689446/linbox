
import URLSafeBase64 from 'urlsafe-base64'

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

export default parsePayload
