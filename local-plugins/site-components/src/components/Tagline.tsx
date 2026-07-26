import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { classNames } from "@quartz-community/utils/lang";

const Tagline: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "tagline", "desktop-only")}>
      <a href="https://alemsabic.com">Alem Šabićs</a> Zettelkästchen der Notizen, Quellen und
      Ideen.
    </div>
  );
};

Tagline.css = `
.tagline {
  font-size: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 2.5rem;
  line-height: 1.1rem;
  font-family: var(--titleFont);
}
`;

export default (() => Tagline) satisfies QuartzComponentConstructor;
