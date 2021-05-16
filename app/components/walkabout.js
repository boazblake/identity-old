const getInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const POS = () => ({
  n: getInt(0, 1),
  x: getInt(0, 1),
  y: getInt(0, 1),
  deg: getInt(0, 360),
})

const state = { pos: POS() }

const updateState = (state) => (obs) => {
  console.log("handlers", state, obs[0].isIntersecting)
  return obs[0].isIntersecting ? (state.pos = POS()) : {}
}

const watchElem = new IntersectionObserver(updateState(state), {})

export const Walkabout = {
  oncreate: ({ dom }) => {
    watchElem.observe(dom)
  },
  view: () => {
    return m(
      "#walk-container",
      { style: {} },
      m("#walk", {
        style: {
          transform: `scale(0.${state.pos.n}) `,
          // transform: `scale(0.${state.pos.n}) translateX(0.${state.pos.x}rem) translateY(0.${state.pos.y}rem) rotate(${state.pos.deg}deg)`,
        },
      })
    )
  },
}
