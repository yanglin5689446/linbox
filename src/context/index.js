
import compose from 'utils/compose'
import { DraftsWrapper } from './drafts'
import { UserWrapper } from './user'
import { MailsWrapper } from './mails'
import { ContactsWrapper } from './contacts'
import { LabelsWrapper } from './labels'


export default compose(
  LabelsWrapper,
  ContactsWrapper,
  MailsWrapper,
  UserWrapper,
  DraftsWrapper,
)
