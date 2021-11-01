import { AnimateChildren, slideInDown } from "styles"
import { Hamburger } from "components"
import { nameFromRoute, randomPause, isSideBarActive } from "utils"

export const Header = {
  view: ({ attrs: { mdl } }) =>
    m(
      "#header.frow.row-center.justify-between",
      {
        style: {
          transitionDuration: 2000,
          backgroundColor: isSideBarActive(mdl) ? "black" : "white",
        },
      },
      [
        m(
          m.route.Link,
          {
            href: "/home",
          },
          m(
            "p.typewriter type-writer",
            {
              id: "logo-header",
              style: {
                color: isSideBarActive(mdl) ? "white" : "black",
              },
              oncreate: ({ dom }) =>
                (dom.onanimationend = () =>
                  setTimeout(() => dom.classList.remove("type-writer"))),
            },
            m("code", "{Boaz Blake}")
          )
        ),
        mdl.settings.profile === "desktop"
          ? m(
              ".navbar.frow",
              {
                oncreate: AnimateChildren(slideInDown, randomPause),
              },
              mdl.routes
                .filter((r) => r !== m.route.get())
                .map((route) =>
                  m(
                    m.route.Link,
                    {
                      class: "navbar-item",
                      href: route,
                      selector: "li",
                    },
                    nameFromRoute(route)
                  )
                )
            )
          : m(Hamburger, { mdl }),
      ]
    ),
}
