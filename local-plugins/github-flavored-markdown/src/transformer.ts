import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import type { QuartzTransformerPlugin } from "@quartz-community/types";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { visit } from "unist-util-visit";

export interface GfmOptions {
  enableSmartyPants: boolean;
  linkHeadings: boolean;
}

const defaultOptions: GfmOptions = {
  enableSmartyPants: true,
  linkHeadings: true,
};

export const GitHubFlavoredMarkdown: QuartzTransformerPlugin<Partial<GfmOptions>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  return {
    name: "GitHubFlavoredMarkdown",
    markdownPlugins() {
      return opts.enableSmartyPants ? [remarkGfm, smartypants] : [remarkGfm];
    },
    htmlPlugins() {
      // Disable popovers for footnote reference links (sup > a) — footnotes link to the
      // bottom of the same page, not another page, so a hover preview doesn't make sense.
      // ale.ms/gpunkt.org customization, ported from v4's citations.ts.
      const footnotePopoverFix = () => {
        return (tree: any) => {
          visit(tree, "element", (node: any, _index: any, parent: any) => {
            if (
              node.tagName === "a" &&
              parent &&
              parent.type === "element" &&
              parent.tagName === "sup"
            ) {
              node.properties = node.properties || {};
              node.properties["data-no-popover"] = true;
            }
          });
        };
      };

      if (opts.linkHeadings) {
        return [
          footnotePopoverFix,
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                role: "anchor",
                ariaHidden: true,
                tabIndex: -1,
                "data-no-popover": true,
              },
              content: {
                type: "element",
                tagName: "svg",
                properties: {
                  width: 18,
                  height: 18,
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                },
                children: [
                  {
                    type: "element",
                    tagName: "path",
                    properties: {
                      d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
                    },
                    children: [],
                  },
                  {
                    type: "element",
                    tagName: "path",
                    properties: {
                      d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
                    },
                    children: [],
                  },
                ],
              },
            },
          ],
        ];
      } else {
        return [footnotePopoverFix];
      }
    },
  };
};
