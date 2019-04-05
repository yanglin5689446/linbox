
import compose from 'utils/compose'
import { DraftsWrapper } from './drafts'
import { UserWrapper } from './user'
import { MailsWrapper } from './mails'
import { ContactsWrapper } from './contacts'


export default compose(
  ContactsWrapper,
  MailsWrapper,
  UserWrapper,
  DraftsWrapper,
)
