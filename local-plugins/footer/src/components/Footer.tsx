import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import style from "./styles/footer.scss";

export interface FooterOptions {
  links: Record<string, string>;
}

// ale.ms/gpunkt.org customization: hardcoded personal links instead of the stock
// "Created with Quartz" line, ported unchanged from v4's Footer.tsx.
export default ((opts?: FooterOptions) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear();
    const links = opts?.links ?? [];
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          <a href="https://alemsabic.com">Alem Šabić</a> © {year} |{" "}
          <a href="https://x.com/sarajevo">x.com/sarajevo</a>
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    );
  };

  Footer.css = style;
  return Footer;
}) satisfies QuartzComponentConstructor;
