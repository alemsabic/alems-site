import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { classNames } from "@quartz-community/utils/lang";

export interface TaglineOptions {
  /** Text of the link */
  linkText: string;
  /** URL the link points to */
  linkUrl: string;
  /** The plain-text part (include leading/trailing space/punctuation as needed) */
  text: string;
  /** Whether the link renders before or after the plain text. Defaults to "before". */
  linkPosition: "before" | "after";
}

const defaultOptions: TaglineOptions = {
  linkText: "Alem Šabićs",
  linkUrl: "https://alemsabic.com",
  text: " Zettelkästchen der Notizen, Quellen und Ideen.",
  linkPosition: "before",
};

// Styling for .tagline lives in quartz/styles/custom.scss (centralized there like every other
// site-wide style), not inlined here via Component.css.
export default ((opts?: Partial<TaglineOptions>) => {
  const options: TaglineOptions = { ...defaultOptions, ...opts };

  const Tagline: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const link = <a href={options.linkUrl}>{options.linkText}</a>;
    const parts = options.linkPosition === "after" ? [options.text, link] : [link, options.text];
    return <div class={classNames(displayClass, "tagline", "desktop-only")}>{parts}</div>;
  };

  return Tagline;
}) satisfies QuartzComponentConstructor<TaglineOptions>;
