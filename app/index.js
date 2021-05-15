import routes from "./routes.js"
import model from "./model.js"
import {
  sendMessage,
  initMithrilInspector,
  saveJsonMdl,
  getLocalMdl,
} from "./init-mithril-inspector"

const root = document.body
let winW = window.innerWidth

if (module.hot) {
  module.hot.accept()
}

if (process.env.NODE_ENV == "development") {
  console.log("Looks like we are in development mode!")
  //mithril - inspector
  // initMithrilInspector(model)

  // const updateMithrilInspector = () => {
  //   const mdl = getLocalMdl()
  //   if (mdl !== JSON.stringify(model)) {
  //     let dto = JSON.stringify(model)
  //     saveJsonMdl(dto)
  //     sendMessage("mithril-inspector", JSON.parse(dto))
  //   }
  //   return requestAnimationFrame(updateMithrilInspector)
  // }

  // updateMithrilInspector(model)
} else {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then((registration) => {
          console.log("⚙️ SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("🧟 SW registration failed: ", registrationError)
        })
    })
  }
}

// set display profiles
const getProfile = (w) => {
  if (w < 668) return "phone"
  if (w < 920) return "tablet"
  return "desktop"
}

// const checkWidth = (winW) => {
//   const w = window.innerWidth
//   if (winW !== w) {
//     winW = w
//     var lastProfile = model.settings.profile
//     model.settings.profile = getProfile(w)
//     if (lastProfile != model.settings.profile) m.redraw()
//   }
//   return requestAnimationFrame(checkWidth)
// }

model.settings.profile = getProfile(winW)

// checkWidth(winW)

if (sessionStorage.getItem("user")) {
  model.user = JSON.parse(sessionStorage.getItem("user"))
}

m.route(root, "/home", routes(model))
