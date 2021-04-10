import { AnimateChildren, sideBarChildren, slideOutLeft } from "styles"
import { nameFromRoute, randomPause } from "utils"

export const SideBar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "ul.sidebar",
        {
          oncreate: AnimateChildren(sideBarChildren(), randomPause),
          onbeforeremove: AnimateChildren(slideOutLeft),
        },
        mdl.routes
          .filter((r) => r !== m.route.get())
          .map((route) =>
            m(
              m.route.Link,
              {
                class: "sidebar-item",
                href: route,
                selector: "li",
              },
              nameFromRoute(route)
            )
          )
      ),
  }
}
