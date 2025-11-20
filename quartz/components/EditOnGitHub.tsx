import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface EditOnGitHubOptions {
  /**
   * Base URL for the GitHub repository
   * Example: "https://github.com/alemsabic/nekontam-zk/blob/main"
   */
  baseUrl: string
  /**
   * Text to display on the button
   */
  buttonText?: string
}

const defaultOptions: EditOnGitHubOptions = {
  baseUrl: "",
  buttonText: "Edit this page on GitHub",
}

export default ((opts?: Partial<EditOnGitHubOptions>) => {
  const options: EditOnGitHubOptions = { ...defaultOptions, ...opts }

  const EditOnGitHub: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    // Get the file path (e.g., "folder/page.md")
    const filePath = fileData.filePath ?? ""

    // Construct the full GitHub edit URL
    const githubUrl = `${options.baseUrl}/${filePath}`

    return (
      <div class={classNames(displayClass, "edit-on-github")}>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          {options.buttonText}
        </a>
      </div>
    )
  }

  EditOnGitHub.css = `
  .edit-on-github {
    margin: 2rem 0 1rem 0;
    text-align: right;
  }

  .edit-on-github a {
    font-size: 0.9rem;
    color: var(--secondary);
    text-decoration: none;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  .edit-on-github a:hover {
    opacity: 1;
    text-decoration: underline;
  }
  `

  return EditOnGitHub
}) satisfies QuartzComponentConstructor<EditOnGitHubOptions>
