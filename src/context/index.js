
import compose from 'utils/compose'
import { LoadingStatusWrapper } from './loadingStatus'
import { DraftsWrapper } from './drafts'
import { UserWrapper } from './user'
import { MailsWrapper } from './mails'
import { ContactsWrapper } from './contacts'
import { LabelsWrapper } from './labels'


export default compose(
  LoadingStatusWrapper,
  LabelsWrapper,
  ContactsWrapper,
  MailsWrapper,
  UserWrapper,
  DraftsWrapper,
)
