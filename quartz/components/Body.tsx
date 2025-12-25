// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
// @ts-ignore
import footnotesScript from "./scripts/footnotes.inline"
import clipboardStyle from "./styles/clipboard.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body">{children}</div>
}

// Combine multiple scripts
Body.afterDOMLoaded = `
  ${clipboardScript};
  ${footnotesScript};
`
Body.css = clipboardStyle

export default (() => Body) satisfies QuartzComponentConstructor
