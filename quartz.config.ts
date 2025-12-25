import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "ale.ms",
    pageTitleSuffix: "Alem Šabić's Notizen und Quellen",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "de-DE",
    baseUrl: "https://ale.ms",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Victor Mono",
        body: "JetBrains Mono",
        code: "Inconsolata",
      },
      colors: {
        lightMode: {
          light: "#e0cca6", // background-color
          lightgray: "rgb(0 0 0 / 20%)",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#8b4840", // link-color
          tertiary: "#9c5e56", // link-color (hover)
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#8fa59933",
        },
        darkMode: {
          light: "#0a0200", //background-color
          lightgray: "rgb(255 255 255 / 20%)",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#8b4840", // link-color
          tertiary: "#9c5e56", // link-color (hover)
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#8fa59933",
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
      Plugin.Citations({
        bibliographyFile: "./content/bibliography.bib",
        suppressBibliography: false,
        linkCitations: false,
        csl: "apa",
        lang: "https://raw.githubusercontent.com/citation-style-language/locales/master/locales-de-DE.xml",
        showTooltips: true,
        tooltipAttribute: "data-tooltip",
      }),
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
