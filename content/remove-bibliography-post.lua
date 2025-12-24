--[[
  remove-bibliography-post.lua

  Pandoc Lua Filter to remove bibliography section AFTER citeproc has run.
  This is a post-processing filter that removes the bibliography div.

  Usage:
    pandoc input.md --citeproc --lua-filter=remove-bibliography-post.lua -o output.html

  IMPORTANT: This filter must run AFTER --citeproc (so footnotes are already generated)

  What it does:
    - Removes <div id="refs"> (bibliography)
    - Removes "References" header
    - Keeps footnotes intact

  Author: Claude Code
  Date: 2025-11-04
]]

-- This filter works on the AST after citeproc has run
-- We need to mark elements for removal, not remove them directly

function Pandoc(doc)
  local blocks = {}
  local skip_next_hr = false

  for i, block in ipairs(doc.blocks) do
    local should_include = true

    -- Check if this is the bibliography div
    if block.t == "Div" and block.identifier == "refs" then
      should_include = false
      skip_next_hr = true  -- Skip the <hr> that comes after
    end

    -- Check if this is the References header
    if block.t == "Header" then
      if block.identifier == "references" or block.identifier == "bibliography" then
        should_include = false
      end
    end

    -- Check if this is an HR that should be skipped
    if block.t == "HorizontalRule" and skip_next_hr then
      should_include = false
      skip_next_hr = false
    end

    if should_include then
      table.insert(blocks, block)
    end
  end

  return pandoc.Pandoc(blocks, doc.meta)
end
