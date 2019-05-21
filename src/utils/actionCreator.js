
import memoize from 'lodash.memoize'

const actionCreator = memoize((type, dispatch) => payload => dispatch({ type, payload }))

export default actionCreator
