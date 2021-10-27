import { AnimateChildren, fadeInUp } from "styles"
import { Pause } from "utils"
import * as pdfjsLib from "pdfjs-dist"
import worker from "pdfjs-dist/build/pdf.worker.entry.js"

const pdfTask = pdfjsLib.getDocument("files/resume.pdf")

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
            href: "files/resume.pdf",
            title: "Boaz Blake Web Dev Resume",
            download: "files/resume.pdf",
          },
          "Download PDF"
        )
      ),
      m("canvas", {
        oncreate: ({ dom }) => {
          pdfjsLib.GlobalWorkerOptions.workerSrc = worker
          pdfTask.promise.then((pdfDocument) => {
            pdfDocument.getPage(1).then((page) => {
              const scale = 1.5
              const viewport = page.getViewport({ scale })
              const outputScale = window.devicePixelRatio || 1
              const ctx = dom.getContext("2d")

              dom.width = Math.floor(viewport.width * outputScale)
              dom.height = Math.floor(viewport.height * outputScale)
              dom.style.width = 0.8 * Math.floor(viewport.width) + "px"
              dom.style.height = 0.8 * Math.floor(viewport.height) + "px"

              const transform =
                outputScale !== 1
                  ? [outputScale, 0, 0, outputScale, 0, 0]
                  : null

              // const renderTask =
              page.render({
                canvasContext: ctx,
                transform,
                viewport,
              })
              // return renderTask.promise
            })
          })
        },
      })
    ),
}
