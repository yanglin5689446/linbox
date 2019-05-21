
import cssParser from 'css'

const processHTMLContent = (scope, raw) => {
  const parser = new DOMParser()
  const serializer = new XMLSerializer()
  const doc = parser.parseFromString(raw, 'text/html')
  // add target='_blank' to all links
  const links = Array.from(doc.getElementsByTagName('a'))
  links.forEach(link => link.setAttribute('target', '_blank'))
  // add target='_blank' to all areas
  const areas = Array.from(doc.getElementsByTagName('area'))
  areas.forEach(link => link.setAttribute('target', '_blank'))

  const stylesheets = Array.from(doc.getElementsByTagName('style'))
  const stripAndAddScope = selectors => selectors
    .filter(selector => selector.toLowerCase !== 'body')
    .map(selector => `#${scope} ${selector}`)
  stylesheets.forEach((stylesheet) => {
    try {
      const css = cssParser.parse(stylesheet.innerText)
      Object.values(css.stylesheet.rules)
        .forEach((rule) => {
          if (rule.type === 'rule') {
            rule.selectors = stripAndAddScope(rule.selectors) // eslint-disable-line
          } else if (rule.type === 'media') {
            rule.rules.forEach((r) => {
              r.selectors = stripAndAddScope(r.selectors)  // eslint-disable-line
            })
          }
        })
      stylesheet.innerText = cssParser.stringify(css, { compress: true })  // eslint-disable-line
    } catch (e) {
      stylesheet.innerText = ''  // eslint-disable-line
    }
  })

  return {
    content: serializer.serializeToString(doc),
  }
}

export default processHTMLContent
