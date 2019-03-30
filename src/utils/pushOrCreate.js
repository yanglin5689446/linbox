
export default (object, key, item) => (object[key] // eslint-disable-line
  ? object[key].push(item)
  : (object[key] = [item])) // eslint-disable-line
