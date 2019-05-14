
import URLSafeBase64 from 'urlsafe-base64'
import compose from 'utils/compose'
import rfc5322 from 'utils/rfc5322'

const encode = compose(
  URLSafeBase64.encode,
  Buffer.from,
  rfc5322,
)

export default encode
