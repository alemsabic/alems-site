import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Tagline: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "tagline", "desktop-only")}>
      <a href="https://alemsabic.com">Alem Šabićs</a> Quellen und Schulungsunterlagen.
    </div>
  )
}

Tagline.css = `
.tagline {
  font-size: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 2.5rem;
  color: var(--secondary);
  line-height: 1.5;
}

.tagline a {
  text-decoration: underline;
}
`

export default (() => Tagline) satisfies QuartzComponentConstructor
