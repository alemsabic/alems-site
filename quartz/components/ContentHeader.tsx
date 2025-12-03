import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { formatDate, getDate } from "./Date"
import readingTime from "reading-time"
import { i18n } from "../i18n"
import { FullSlug, resolveRelative } from "../util/path"

interface ContentHeaderOptions {
  /**
   * Base URL for the GitHub repository
   */
  baseUrl: string
  /**
   * Text to display for the edit link
   */
  editButtonText?: string
  /**
   * Whether to show tags in the header
   */
  showTags?: boolean
}

const defaultOptions: ContentHeaderOptions = {
  baseUrl: "",
  editButtonText: "Verbesser die Seite auf GitHub.",
  showTags: false,
}

export default ((opts?: Partial<ContentHeaderOptions>) => {
  const options: ContentHeaderOptions = { ...defaultOptions, ...opts }

  const ContentHeader: QuartzComponent = ({ cfg, fileData, displayClass }: QuartzComponentProps) => {
    const title = fileData.frontmatter?.title
    const text = fileData.text
    const tags = fileData.frontmatter?.tags

    // Check if ContentHeader should be hidden via frontmatter
    const showContentHeader = fileData.frontmatter?.showContentHeader !== false

    // Get file path for edit link
    let filePath = fileData.filePath ?? ""
    if (filePath.startsWith("content/")) {
      filePath = filePath.substring("content/".length)
    }
    const githubUrl = `${options.baseUrl}/${filePath}`

    // Only render if there's content and showContentHeader is not false
    if (!text || !showContentHeader) return null

    // Calculate reading time with German plural rules
    const { minutes } = readingTime(text)
    const minutesCount = Math.ceil(minutes)
    let readingTimeText
    if (minutesCount === 1) {
      readingTimeText = "1 Minute."
    } else {
      readingTimeText = `${minutesCount} Minuten.`
    }

    // Get date
    const date = getDate(cfg, fileData)
    const dateText = date ? formatDate(date, cfg.locale) : null

    return (
      <div class={classNames(displayClass, "content-header")}>
        <dl>
          {title && (
            <>
              <dt>Titel:</dt>
              <dd>{title}.</dd>
            </>
          )}

          {dateText && (
            <>
              <dt>Datum:</dt>
              <dd>
                <time datetime={date!.toISOString()}>{dateText}</time>
              </dd>
            </>
          )}

          <dt>Lesezeit:</dt>
          <dd>{readingTimeText}</dd>

          {options.showTags && tags && tags.length > 0 && (
            <>
              <dt>Tags:</dt>
              <dd class="tags-inline">
                {tags.map((tag, index) => {
                  const linkDest = resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)
                  return (
                    <span key={tag}>
                      <a href={linkDest} class="internal tag-link">
                        {tag}
                      </a>
                      {index < tags.length - 1 && ", "}
                    </span>
                  )
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
    )
  }

  ContentHeader.css = `
  .content-header {
    text-align: right;
    margin: 1rem 0 2.5rem 0;
    padding: 0.75rem 0;
    padding-right: 0;
  }

  .content-header dl {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--darkgray);
  }

  .content-header dt {
    display: inline;
    margin-right: 0.5rem;
    color: var(--darkgray);
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
  `

  return ContentHeader
}) satisfies QuartzComponentConstructor<ContentHeaderOptions>
