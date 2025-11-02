import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Tagline: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "tagline", "desktop-only")}>
      Rječnik sarajevskog žargona
    </div>
  )
}

Tagline.css = `
.tagline {
  font-size: 0.9rem;
  margin: 0;
  color: var(--gray);
}
`

export default (() => Tagline) satisfies QuartzComponentConstructor
