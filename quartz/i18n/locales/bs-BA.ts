import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "Neimenovano",
    description: "Opis nije naveden",
  },
  components: {
    callout: {
      note: "Napomena",
      abstract: "Sažetak",
      info: "Info",
      todo: "Za uraditi",
      tip: "Savjet",
      success: "Uspjeh",
      question: "Pitanje",
      warning: "Upozorenje",
      failure: "Neuspjeh",
      danger: "Opasnost",
      bug: "Greška",
      example: "Primjer",
      quote: "Citat",
    },
    backlinks: {
      title: "Povratne veze",
      noBacklinksFound: "Nema povratnih veza",
    },
    themeToggle: {
      lightMode: "Svijetli način",
      darkMode: "Tamni način",
    },
    readerMode: {
      title: "Način čitanja",
    },
    explorer: {
      title: "Istraživač",
    },
    footer: {
      createdWith: "Kreirano sa",
    },
    graph: {
      title: "Grafički prikaz",
    },
    recentNotes: {
      title: "Nedavno izmijenjene stranice",
      seeRemainingMore: ({ remaining }) => `Pogledaj još ${remaining} →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `Uključenje iz ${targetSlug}`,
      linkToOriginal: "Link ka originalu",
    },
    search: {
      title: "Pretraga",
      searchBarPlaceholder: "Pretraži nešto",
    },
    tableOfContents: {
      title: "Sadržaj",
    },
    contentMeta: {
      readingTime: ({ minutes }) => minutes === 1 ? `1 minut čitanja.` : `${minutes} minuta čitanja.`,
    },
  },
  pages: {
    rss: {
      recentNotes: "Nedavno izmijenjene stranice",
      lastFewNotes: ({ count }) => `Posljednjih ${count} stranica`,
    },
    error: {
      title: "Nije pronađeno",
      notFound: "Ova stranica je ili privatna ili ne postoji.",
      home: "Povratak na početnu stranicu",
    },
    folderContent: {
      folder: "Folder",
      itemsUnderFolder: ({ count }) =>
        count === 1 ? "1 datoteka u ovom folderu." : `${count} datoteka u ovom folderu.`,
    },
    tagContent: {
      tag: "Oznaka",
      tagIndex: "Pregled oznaka",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "1 datoteka sa ovom oznakom." : `${count} datoteka sa ovom oznakom.`,
      showingFirst: ({ count }) => `Prikazuje se prvih ${count} oznaka.`,
      totalTags: ({ count }) => `Ukupno ${count} oznaka.`,
    },
  },
} as const satisfies Translation
