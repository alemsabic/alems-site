import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Tagline: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "tagline", "desktop-only")}>
      <strong>Az.:</strong> 666/REF/X | Wir garantieren akademische Präzision bei absoluter moralischer Verwahrlosung.
    </div>
  )
}

Tagline.css = `
.tagline {
  font-size: 0.9rem;
  margin: 0;
  color: var(--gray);
  line-height: 1.5;
}
`

export default (() => Tagline) satisfies QuartzComponentConstructor
