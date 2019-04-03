
export default raw => (
  `${'Content-Type: text/html\n'
  + 'Content-Transfer-Encoding: base64\n'
  + `From: ${raw.sender}\n`
  + `To: ${raw.receipients}\n`
  + `Subject: ${raw.subject}\n\n`}${
    window.btoa(raw.content)}`
)
