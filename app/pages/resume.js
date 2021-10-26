import { AnimateChildren, fadeInUp } from "styles"
import { Pause } from "utils"

export const Resume = {
  view: () =>
    m(
      ".frow-container",
      {
        oncreate: AnimateChildren(fadeInUp, Pause(0.15)),
      },
      m(
        ".frow",
        {
          style: {
            border: "1px solid",
            borderRadius: "50%",
            width: "200px",
            height: "30px",
            padding: "5px",
            boxShadow: "0 0 6px rgb(0 0 0 / 20%)",
          },
        },
        m(
          "a",
          {
            href: "files/resume.docx",
            title: "Boaz Blake Web Dev Resume",
            download: "files/resume.docx",
          },
          "Download PDF"
        )
      ),
      m("img", {
        id: "resume-1",
        src: "images/resume.jpg",
        style: { objectFit: "contain", width: "100%" },
      })
    ),
}
