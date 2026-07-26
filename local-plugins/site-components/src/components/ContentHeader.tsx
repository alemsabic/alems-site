import type {
  FullSlug,
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { classNames } from "@quartz-community/utils/lang";
import { getDate } from "@quartz-community/utils/sort";
import { resolveRelative } from "@quartz-community/utils/path";

interface ContentHeaderOptions {
  /** Base URL for the GitHub repository */
  baseUrl: string;
  /** Text to display for the edit link */
  editButtonText?: string;
  /** Whether to show tags in the header */
  showTags?: boolean;
}

const defaultOptions: ContentHeaderOptions = {
  baseUrl: "",
  editButtonText: "Verbesser die Seite auf GitHub.",
  showTags: false,
};

// ale.ms/gpunkt.org customization: date + edit-on-GitHub link below the article title (beforeBody,
// its original v4 position — briefly moved to afterBody/.page-footer on 2026-07-26, reverted same
// day at the user's request). Word count was dropped 2026-07-26 at the user's request (found
// superfluous); date, tags, and edit link remain. Deliberately does NOT use
// @quartz-community/utils/date's formatDate (stock locale-based format) -- a hardcoded DD.MM.YYYY
// format is used instead, same spirit as v4's own quartz/components/Date.tsx override. Note: v4's
// version had a trailing period (`26.07.2026.`) — dropped here 2026-07-26 at the user's request
// (noticed it looked wrong, confirmed it was already present on live v4 too, not a v5 artifact).
export default ((opts?: Partial<ContentHeaderOptions>) => {
  const options: ContentHeaderOptions = { ...defaultOptions, ...opts };

  const ContentHeader: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const text = fileData.text;
    const tags = fileData.frontmatter?.tags as string[] | undefined;

    // Check if ContentHeader should be hidden via frontmatter
    const showContentHeader = fileData.frontmatter?.showContentHeader !== false;

    // Get file path for edit link
    let filePath = fileData.filePath ?? "";
    if (filePath.startsWith("content/")) {
      filePath = filePath.substring("content/".length);
    }
    const githubUrl = `${options.baseUrl}/${filePath}`;

    // Only render if there's content and showContentHeader is not false
    if (!text || !showContentHeader) return null;

    // Get date (hardcoded DD.MM.YYYY. format, matches v4's Date.tsx override)
    const date = getDate(fileData);
    const dateText = date ? formatDate(date) : null;

    return (
      <div class={classNames(displayClass, "content-header")}>
        <dl>
          {dateText && (
            <>
              <dt>Datum:</dt>
              <dd>
                <time dateTime={date!.toISOString()}>{dateText}</time>
              </dd>
            </>
          )}

          {options.showTags && tags && tags.length > 0 && (
            <>
              <dt>Schlagwörter:</dt>
              <dd class="tags-inline">
                {tags.map((tag, index) => {
                  const linkDest = resolveRelative(
                    fileData.slug! as FullSlug,
                    `tags/${tag}` as FullSlug,
                  );
                  return (
                    <span key={tag}>
                      <a href={linkDest} class="internal tag-link">
                        {tag}
                      </a>
                      {index < tags.length - 1 && ", "}
                    </span>
                  );
                })}
              </dd>
            </>
          )}

          <dd>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              {options.editButtonText}
            </a>
          </dd>
        </dl>
      </div>
    );
  };

  ContentHeader.css = `
  .content-header {
    text-align: right;
    margin: 1rem 0 2.5rem 0;
    padding: 0.75rem 0;
    padding-right: 0;
  }

  .content-header dl {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--darkgray);
  }

  .content-header dt {
    display: inline;
    margin-right: 0.5rem;
    color: var(--secondary);
    opacity: 0.5;
  }

  .content-header dd {
    display: inline;
    margin: 0;
  }

  .content-header dd::after {
    content: "";
    display: block;
    margin-bottom: 0.25rem;
  }

  .content-header a {
    color: var(--secondary);
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .content-header a:hover {
    opacity: 0.7;
    text-decoration: underline;
  }

  .content-header .tags-inline {
    display: inline;
  }

  .content-header .tags-inline a.tag-link {
    color: var(--secondary);
    font-size: 0.7rem;
  }
  `;

  return ContentHeader;
}) satisfies QuartzComponentConstructor<ContentHeaderOptions>;

function formatDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}
