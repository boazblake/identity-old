import { Layout } from "components"
import { AnimatePage, slideOutLeft, slideInRight } from "styles"
import { Home, About, Portfolio, Snippets, Resume } from "pages"

const routes = (mdl) => {
  return {
    "/home": {
      onmatch: (_, b) => {
        mdl.slug = b
        mdl.status.sidebar = false
        window.scrollTo(0, 0)
      },
      render: () =>
        m(
          Layout,
          { mdl },
          m(Home, {
            oncreate: AnimatePage(slideInRight),
            onscroll: (e) => console.log(e),
            onbeforeremove: AnimatePage(slideOutLeft),
            mdl,
          })
        ),
    },

    "/portfolio": {
      onmatch: (_, b) => {
        mdl.slug = b
        mdl.status.sidebar = false
        window.scrollTo(0, 0)
      },
      render: () =>
        m(
          Layout,
          { mdl },
          m(Portfolio, {
            oncreate: AnimatePage(slideInRight),
            onscroll: (e) => console.log(e),
            onbeforeremove: AnimatePage(slideOutLeft),
            mdl,
          })
        ),
    },

    "/resume": {
      onmatch: (_, b) => {
        mdl.slug = b
        mdl.status.sidebar = false
        window.scrollTo(0, 0)
      },
      render: () =>
        m(
          Layout,
          { mdl },
          m(Resume, {
            oncreate: AnimatePage(slideInRight),
            onscroll: (e) => console.log(e),
            onbeforeremove: AnimatePage(slideOutLeft),
            mdl,
          })
        ),
    },

    "/snippets": {
      onmatch: (_, b) => {
        mdl.slug = b
        mdl.status.sidebar = false
        window.scrollTo(0, 0)
      },
      render: () =>
        m(
          Layout,
          { mdl },
          m(Snippets, {
            oncreate: AnimatePage(slideInRight),
            onscroll: (e) => console.log(e),
            onbeforeremove: AnimatePage(slideOutLeft),
            mdl,
          })
        ),
    },

    "/about": {
      onmatch: (_, b) => {
        mdl.slug = b
        mdl.status.sidebar = false
        window.scrollTo(0, 0)
      },
      render: () =>
        m(
          Layout,
          { mdl },
          m(About, {
            oncreate: AnimatePage(slideInRight),
            onscroll: (e) => console.log(e),
            onbeforeremove: AnimatePage(slideOutLeft),
            mdl,
          })
        ),
    },
  }
}

export default routes
