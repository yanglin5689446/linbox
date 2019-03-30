
import compose from 'utils/compose'
import { DraftsWrapper } from './drafts'
import { UserWrapper } from './user'
import { MailsWrapper } from './mails'


export default compose(
  MailsWrapper,
  UserWrapper,
  DraftsWrapper,
)
