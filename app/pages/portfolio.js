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

const getRepos = () =>
  m.request({
    url: "https://api.github.com/users/boazblake/repos?sort=asc&per_page=100",
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })

const getRepo = (state) =>
  m.request({
    url: `https://api.github.com/repos/boazblake/${state.name}`,
  })

const Repo = () => {
  const state = {
    name: "",
    status: "loading",
  }
  return {
    oninit: ({ attrs: { url } }) => {
      state.name = url.split("/")[3]
      getRepo(state).then(
        ({ description }) => {
          state.errors = null
          state.info = description && description.split("~")[0]
          state.src = description && description.split("~")[1]
          state.status = "loaded"
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
    repos: [],
    errors: {},
  }

  return {
    oninit: getRepos().then(
      (repos) => {
        state.status = "loaded"
        state.repos = repos
          .filter((repo) => {
            return (
              repo.homepage &&
              repo.homepage.includes("boazblake") &&
              repo.description &&
              repo.description.split("~")[1]
            )
          })
          .map((repo) => repo.homepage)
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
          state.repos.map((url) => m(Repo, { url, mdl }))
      ),
  }
}
