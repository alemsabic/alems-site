import { describe, expect, it } from "vitest";
import {
  ALPHABET,
  bucketLetter,
  buildIndexEntries,
  groupByLetter,
  resolveDisplayTitle,
  sortKeyForTitle,
} from "../src/util/entries";

describe("ALPHABET", () => {
  it("has all 26 uppercase letters in order", () => {
    expect(ALPHABET).toHaveLength(26);
    expect(ALPHABET[0]).toBe("A");
    expect(ALPHABET[25]).toBe("Z");
  });
});

describe("resolveDisplayTitle", () => {
  it("prefers shortTitle over title", () => {
    expect(
      resolveDisplayTitle({
        frontmatter: { shortTitle: "Ahrens (2017)", title: "A Very Long Zotero Citation" },
        slug: "literatur/ahrens",
      }),
    ).toBe("Ahrens (2017)");
  });

  it("falls back to title when shortTitle is absent", () => {
    expect(
      resolveDisplayTitle({ frontmatter: { title: "Atomizität im ZK" }, slug: "atomizitaet-im-zk" }),
    ).toBe("Atomizität im ZK");
  });

  it("falls back to the last non-index slug segment when both are absent", () => {
    expect(resolveDisplayTitle({ frontmatter: {}, slug: "folder/my-note" })).toBe("my-note");
  });

  it("treats a literal title of 'index' as absent", () => {
    expect(resolveDisplayTitle({ frontmatter: { title: "index" }, slug: "folder/index" })).toBe(
      "folder",
    );
  });
});

describe("sortKeyForTitle", () => {
  it("lowercases and maps German umlauts to their base letter", () => {
    expect(sortKeyForTitle("Ähre")).toBe("ahre");
    expect(sortKeyForTitle("Übersicht")).toBe("ubersicht");
    expect(sortKeyForTitle("Ökonomie")).toBe("okonomie");
  });

  it("expands ß to ss", () => {
    expect(sortKeyForTitle("Straße")).toBe("strasse");
  });

  it("strips other combining diacritics", () => {
    expect(sortKeyForTitle("café")).toBe("cafe");
  });
});

describe("bucketLetter", () => {
  it("buckets by the first letter of the sort key, uppercased", () => {
    expect(bucketLetter("Ähre")).toBe("A");
    expect(bucketLetter("zettelkasten")).toBe("Z");
  });

  it("buckets titles starting with a digit or symbol under '#'", () => {
    expect(bucketLetter("3-Body Problem")).toBe("#");
    expect(bucketLetter("")).toBe("#");
  });
});

describe("buildIndexEntries", () => {
  const files = [
    { slug: "index", frontmatter: { title: "index" } },
    { slug: "atomizitaet-im-zk", frontmatter: { title: "Atomizität im ZK" } },
    { slug: "beobachtung-zweiter-ordnung", frontmatter: { title: "Beobachtung zweiter Ordnung" } },
    { slug: "literatur/index", frontmatter: { title: "Literatur" } },
    { slug: "draft-note", frontmatter: { title: "Draft" }, unlisted: true },
  ];

  it("excludes the index page itself", () => {
    const result = buildIndexEntries(files as never);
    expect(result.some((e) => e.slug === "index")).toBe(false);
  });

  it("excludes folder-index pages", () => {
    const result = buildIndexEntries(files as never);
    expect(result.some((e) => e.slug === "literatur/index")).toBe(false);
  });

  it("excludes unlisted pages", () => {
    const result = buildIndexEntries(files as never);
    expect(result.some((e) => e.slug === "draft-note")).toBe(false);
  });

  it("sorts entries alphabetically by German sort key", () => {
    const result = buildIndexEntries(files as never);
    expect(result.map((e) => e.title)).toEqual([
      "Atomizität im ZK",
      "Beobachtung zweiter Ordnung",
    ]);
  });

  it("excludes tag pages (slugs starting with 'tags/')", () => {
    const filesWithTags = [
      { slug: "atomizitaet-im-zk", frontmatter: { title: "Atomizität im ZK" } },
      { slug: "tags/autopoiesis", frontmatter: { title: "autopoiesis" } },
      { slug: "tags/zettelkasten/prinzipien", frontmatter: { title: "zettelkasten/prinzipien" } },
    ];
    const result = buildIndexEntries(filesWithTags as never);
    expect(result.some((e) => e.slug.startsWith("tags/"))).toBe(false);
    expect(result.map((e) => e.slug)).toEqual(["atomizitaet-im-zk"]);
  });

  it("excludes the 404 page (slug === '404')", () => {
    const filesWithNotFound = [
      { slug: "atomizitaet-im-zk", frontmatter: { title: "Atomizität im ZK" } },
      { slug: "404", frontmatter: { title: "Nicht gefunden" } },
    ];
    const result = buildIndexEntries(filesWithNotFound as never);
    expect(result.some((e) => e.slug === "404")).toBe(false);
    expect(result.map((e) => e.slug)).toEqual(["atomizitaet-im-zk"]);
  });

  it("excludes .base view pages (slugs ending with '.base')", () => {
    const filesWithBase = [
      { slug: "atomizitaet-im-zk", frontmatter: { title: "Atomizität im ZK" } },
      { slug: "literatur/index.base", frontmatter: { title: "Index" } },
    ];
    const result = buildIndexEntries(filesWithBase as never);
    expect(result.some((e) => e.slug.endsWith(".base"))).toBe(false);
    expect(result.map((e) => e.slug)).toEqual(["atomizitaet-im-zk"]);
  });
});

describe("groupByLetter", () => {
  it("groups entries under their bucket letter, in '#'→A→Z order, omitting empty letters", () => {
    const entries = [
      { slug: "a1", title: "Atomizität" },
      { slug: "a2", title: "Autopoiesis" },
      { slug: "z1", title: "Zirkularität" },
      { slug: "n1", title: "3-Body Problem" },
    ];
    const groups = groupByLetter(entries);
    expect(groups.map((g) => g.letter)).toEqual(["#", "A", "Z"]);
    expect(groups[1]!.entries.map((e) => e.slug)).toEqual(["a1", "a2"]);
  });

  it("returns an empty array for no entries", () => {
    expect(groupByLetter([])).toEqual([]);
  });
});
