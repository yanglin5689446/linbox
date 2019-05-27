
import { useCallback } from 'react'

const useActionCreator = (type, dispatch) => useCallback(payload => dispatch({ type, payload }),
  [type, dispatch])

export default useActionCreator
