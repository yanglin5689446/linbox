
export default (message) => {
  const header = message.payload.headers.find(e => e.name === 'From').value
  const mailRegex = /([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)/g
  const mail = header.match(mailRegex)[0]
  const name = header.replace(mail, '').replace(' <>', '').replace(/"/g, '')
  return { name, mail }
}
