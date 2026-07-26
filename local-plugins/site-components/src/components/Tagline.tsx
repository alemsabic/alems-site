import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { classNames } from "@quartz-community/utils/lang";

export interface TaglineOptions {
  /** Text of the link at the start of the tagline */
  linkText: string;
  /** URL the link points to */
  linkUrl: string;
  /** Text following the link (include leading space/punctuation as needed) */
  text: string;
}

const defaultOptions: TaglineOptions = {
  linkText: "Alem Šabićs",
  linkUrl: "https://alemsabic.com",
  text: " Zettelkästchen der Notizen, Quellen und Ideen.",
};

// Styling for .tagline lives in quartz/styles/custom.scss (centralized there like every other
// site-wide style), not inlined here via Component.css.
export default ((opts?: Partial<TaglineOptions>) => {
  const options: TaglineOptions = { ...defaultOptions, ...opts };

  const Tagline: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={classNames(displayClass, "tagline", "desktop-only")}>
        <a href={options.linkUrl}>{options.linkText}</a>
        {options.text}
      </div>
    );
  };

  return Tagline;
}) satisfies QuartzComponentConstructor<TaglineOptions>;
