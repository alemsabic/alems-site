import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Tagline: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "tagline", "desktop-only")}>
      <a href="https://alemsabic.com">Alem Šabić</a>'s Notizen und Quellen.
    </div>
  )
}

Tagline.css = `
.tagline {
  font-size: 1rem;
  margin: 0;
  color: var(--secondary);
  line-height: 1.5;
}
`

export default (() => Tagline) satisfies QuartzComponentConstructor
