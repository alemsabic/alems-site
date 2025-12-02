import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "PATHOLOGIE",
    pageTitleSuffix: "Quellenangaben für Gpunkt.org Satiremagazin",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "de-DE",
    baseUrl: "https://pathologie.gpunkt.org",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Victor Mono",
        body: "Geist Mono",
        code: "Inconsolata",
      },
      colors: {
        lightMode: {
          light: "#d4c4a8",
          lightgray: "#c4b498",
          gray: "#a49484",
          darkgray: "#6b5b4b",
          dark: "#2b1810",
          secondary: "#8b3a2b",
          tertiary: "#84a59d",
          highlight: "rgba(139, 58, 43, 0.15)",
          textHighlight: "#8b3a2b88",
        },
        darkMode: {
          light: "#0a0a0a",
          lightgray: "#1a1a1a",
          gray: "#646464",
          darkgray: "#b8b8b8",
          dark: "#e8e8e8",
          secondary: "#8b3a2b",
          tertiary: "#84a59d",
          highlight: "rgba(139, 58, 43, 0.15)",
          textHighlight: "#8b3a2b88",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents({
        minEntries: 4, // Only show TOC if 4+ headings (rare in atomic notes)
        maxDepth: 3,
        showByDefault: true,
        collapseByDefault: false,
      }),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(), // Deactivated due to font rendering error (Sept 11, 2025)
    ],
  },
}

export default config
