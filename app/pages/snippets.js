import { TicTacToe, GameOfLife, ShapeShifter } from "components"
import { jsonCopy } from "utils"

let snippets = [TicTacToe, , GameOfLife, ShapeShifter]

const Snippet = {
  view: ({ attrs: { snip, Flems } }) => {
    return m(".snippet", [
      m("a.snippet-title", { href: snip.url, target: "__blank" }, snip.title),
      m(".snippet-code", {
        id: snip.id,
        style: { height: "500px" },
        oncreate: ({ dom }) => Flems(dom, jsonCopy(snip.code)),
      }),
    ])
  },
}

export const Snippets = ({ attrs: { mdl } }) => {
  return {
    view: () =>
      m(
        ".snippets",
        snippets.map((snip) => m(Snippet, { snip, Flems: window.Flems }))
      ),
  }
}
