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
    Component.ContentHeader({
      baseUrl: "https://github.com/alemsabic/alems-notizen/blob/main",
      editButtonText: "Verbesser die Seite auf GitHub.",
      showTags: false,
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.Tagline(),
    Component.Explorer(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
  afterBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        limit: 5,
        showTags: false,
        linkToMore: false,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "alemsabic/pathologie-site",
        repoId: "R_kgDOQg3eGw",
        category: "General",
        categoryId: "DIC_kwDOQg3eG84CzVVP",
        mapping: "pathname",
        strict: false,
        reactionsEnabled: true,
        inputPosition: "bottom",
        lang: "de",
        lightTheme: "light",
        darkTheme: "dark",
        themeUrl: "https://pathologie.gpunkt.org/static/giscus",
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
    Component.PageTitle(),
    Component.Tagline(),
    Component.Explorer(),
  ],
  right: [],
}
