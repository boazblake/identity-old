const hasRepos = () => {
  let age = parseInt(localStorage.getItem("repos-date"))
  let now = Date.now()

  return (now - age) / 1000 >= 3600
    ? (localStorage.clear("repos"), null)
    : localStorage.getItem("repos")
}

const fetchRepos = (mdl) => {
  mdl.portfolio.reposList = JSON.parse(hasRepos())
  return mdl.portfolio.reposList
}
const saveRepos = (repos) => {
  localStorage.setItem("repos-date", JSON.stringify(Date.now()))
  localStorage.setItem("repos", JSON.stringify(repos))
  return repos
}

const hasRepo = (name) => localStorage.getItem(name)
const fetchRepo = (name) => JSON.parse(hasRepo(name))
const saveRepo = (name) => (repo) => {
  localStorage.setItem(name, JSON.stringify(repo))
  return repo
}

const handler = (entry) =>
  entry.forEach(
    (change) => (change.target.style.opacity = change.isIntersecting ? 1 : 0)
  )

const opacityObs = new IntersectionObserver(handler)

const RepoLink = {
  view: ({ attrs: { url } }) =>
    m(
      "a.github-app-link",
      {
        href: `https://boazblake.github.io/${url}`,
        target: "_blank",
        title: url,
      },
      url
    ),
}

const getRepos = (mdl) => {
  return hasRepos()
    ? Promise.resolve(fetchRepos(mdl))
    : m
        .request({
          url: "https://api.github.com/users/boazblake/repos?sort=asc&per_page=100",
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        })
        .then(saveRepos)
}

const getRepo = (state) => {
  return hasRepo(state.name)
    ? Promise.resolve(fetchRepo(state.name))
    : m
        .request({
          url: `https://api.github.com/repos/boazblake/${state.name}`,
        })
        .then(saveRepo(state.name))
}

const Repo = () => {
  const state = {
    name: "",
    status: "loading",
  }
  return {
    oninit: ({ attrs: { mdl, url } }) => {
      state.name = url.split("/")[3]
      getRepo(state).then(
        ({ description }) => {
          state.errors = null
          state.info = description && description.split("~")[0]
          state.src = description && description.split("~")[1]
          state.status = "loaded"
          mdl.portfolio.repos[state.name] = { description }
          hasRepo(state.name) && m.redraw()
        },
        (errors) => {
          state.status = "failed"
          state.errors = errors
        }
      )
    },
    view: () => {
      return (
        state.status == "loading" && "Repo Loading...",
        state.status == "failed" && "Error",
        state.status == "loaded" &&
          m(
            ".repo",
            {
              oncreate: ({ dom }) =>
                state.status == "loaded" && opacityObs.observe(dom),
              style: { opacity: 1 },
            },
            m(
              ".col-md-3-3",

              [
                m(".repo-title", [m(RepoLink, { url: state.name })]),
                m("img", { width: "200px", src: state.src }),
                m(".info", state.info),
              ]
            )
          )
      )
    },
  }
}

export const Portfolio = () => {
  const state = {
    status: "loading",
    errors: {},
  }

  return {
    oninit: ({ attrs: { mdl } }) =>
      getRepos(mdl)
        .then((repos) =>
          repos
            .filter((repo) => {
              return (
                repo.homepage &&
                repo.homepage.includes("boazblake") &&
                repo.description &&
                repo.description.split("~")[1]
              )
            })
            .map((repo) => repo.homepage)
        )
        .then(
          (repos) => {
            mdl.portfolio.reposList = repos
            state.status = "loaded"
            hasRepos() && m.redraw()
          },
          (errors) => {
            state.status = "failed"
            state.errors = errors
          }
        ),
    view: ({ attrs: { mdl } }) =>
      m(
        ".frow",
        state.status == "failed" && "Error fetching Repos ...",
        state.status == "loading" && "Loading Repos ...",
        state.status == "loaded" &&
          mdl.portfolio.reposList.map((url) => m(Repo, { url, mdl }))
      ),
  }
}
