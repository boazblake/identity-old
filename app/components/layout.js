import { Animate, sideBarIn, slideOutRight } from "styles"
import { Header, SideBar } from "components"

export const Layout = () => {
  return {
    view: ({ attrs: { mdl }, children }) =>
      m(".app", [
        m(Header, { mdl }),
        m(".page", children),
        mdl.status.sidebar &&
          mdl.settings.profile !== "desktop" &&
          m(SideBar, {
            oncreate: Animate(sideBarIn()),
            onbeforeremove: Animate(slideOutRight),
            mdl,
          }),
      ]),
  }
}
