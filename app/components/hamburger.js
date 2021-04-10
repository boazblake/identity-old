import { isSideBarActive } from "utils"

export const Hamburger = {
  view: ({ attrs: { mdl } }) =>
    m(
      "div.nav-icon",
      {
        class: isSideBarActive(mdl) ? "is-active" : "",
        onclick: (e) => {
          mdl.status.sidebar = !mdl.status.sidebar
        },
      },
      m("div")
    ),
}
