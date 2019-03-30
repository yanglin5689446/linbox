
import { DraftsWrapper } from './drafts'
import { UserWrapper } from './user'

export default App => UserWrapper(DraftsWrapper(App))
