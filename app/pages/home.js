import { AnimateChildren, fadeInUp, Animate, popIn } from "styles"
import { log, randomPause, Pause } from "utils"
import { Walkabout } from "components"

export const Home = {
  view: () =>
    m(
      ".home",
      {
        oncreate: AnimateChildren(fadeInUp, Pause(0.05)),
      },
      [
        m(
          ".frow",
          m("img#boazface", {
            src: "images/boazface.webp",
          }),
          m(".frow.row-around", { padding: "2px" }, [
            m(
              "a",
              {
                oncreate: Animate(popIn, randomPause),
                target: "_blank",
                href: "https://github.com/boazblake",
              },
              m("img", {
                style: { margin: "2px", height: "100px", width: "100px" },
                src: "images/github.svg",
              })
            ),
            m(
              "a",
              {
                oncreate: Animate(popIn, randomPause),
                target: "_blank",
                href: "https://www.linkedin.com/in/boazblake/",
              },
              m("img", {
                style: { margin: "2px", height: "100px", width: "100px" },
                src: "images/linkedin.svg",
              })
            ),
            m(Walkabout),
          ])
        ),
        m(
          "p",
          m(
            "code",
            { style: { color: "black", margin: "4px", fontSize: "2rem" } },
            "Front-End developer with half a decade of industry experience building a variety of different applications using a multitude of different frameworks and languages."
          )
        ),
        m(
          "p",
          m(
            "code",
            { style: { color: "black", margin: "4px", fontSize: "1rem" } },
            "Contact:",
            "boazBlake at protonMail dot com"
          )
        ),
      ]
    ),
}
