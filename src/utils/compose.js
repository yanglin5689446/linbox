
// copy from recompose source code
// https://github.com/acdlite/recompose

const compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg)

export default compose
