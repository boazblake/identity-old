const model = {
  state: {
    isLoading: false,
    loadingProgress: { max: 0, value: 0 },
    isLoggedIn: () => sessionStorage.getItem("token"),
  },
  routes: [
    "/home",
    "/portfolio",
    // "/snippets",
    // "/about",
    "/resume",
  ],
  status: { sidebar: false },
  settings: { width: "", profile: "", inspector: "" },
  snippets: [],
  slug: "",
}

export default model
