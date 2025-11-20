import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {},
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
    Component.EditOnGitHub({
      baseUrl: "https://github.com/alemsabic/nekontam-zk/blob/main",
      buttonText: "Edit this page on GitHub",
    }),
  ],
  left: [
    // Component.ProfileImage(), // Removed - uncomment to restore
    Component.PageTitle(),
    Component.Tagline(),
    Component.Explorer(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
  afterBody: [
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "alemsabic/nekontam-zk",
        repoId: "R_kgDOP_ghmA",
        category: "Announcements",
        categoryId: "DIC_kwDOP_ghmM4CyARO",
        mapping: "pathname",
        strict: false,
        reactionsEnabled: true,
        inputPosition: "bottom",
        lang: "hbs",
        lightTheme: "light",
        darkTheme: "dark",
      },
    }),
    Component.Backlinks(),
    Component.Graph(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    // Component.ProfileImage(), // Removed - uncomment to restore
    Component.PageTitle(),
    Component.Tagline(),
    Component.Explorer(),
  ],
  right: [],
}
