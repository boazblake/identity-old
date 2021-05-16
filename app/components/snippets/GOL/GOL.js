export const GOL =
  'const Stream  = m.stream\nconst compose = R.compose\nconst range = R.range\nconst without = R.without\nconst values = R.values\nconst root = document.getElementById(\'GameOfLife\')\nconst siblingCoords = [[-1, 0],[-1, 1],[0, 1],[1, 1],[1, 0],[1, -1],[0, -1],[-1, -1]]\n\nconst model = {\n  isRunning: Stream(false),\n  board: {},\n  delay: Stream(1000),\n  randomized: Stream(15),\n  size: Stream(30),\n  width: Stream(800),\n  lifecycle: Stream(0)\n}\n\nconst restart = (mdl) => {\n  mdl.isRunning(false)\n  mdl.delay(1000)\n  mdl.randomized(15)\n  mdl.size(30)\n  mdl.width(800)\n  mdl.lifecycle(0)\n  return mdl\n}\n\n\nconst withinBounds = (limit) => (coords) =>\n  !(coords.includes(limit) || coords.includes(-1))\n\nconst toSiblingModel = (acc, sibling) => {\n  acc[sibling] = false\n  return acc\n}\n\nconst calcSiblings = (limit) => (sibCoords) => (coords) =>\n  sibCoords\n    .map((sib) => [sib[0] + coords[0], sib[1] + coords[1]])\n    .filter(withinBounds(limit))\n    .reduce(toSiblingModel, {})\n\nconst makeCell = (mdl) => (size) => (idx) => {\n  let coords = [idx % size, Math.floor(idx / size)]\n  let siblings = calcSiblings(size)(siblingCoords)(coords)\n  let cell = {\n    key: idx,\n    value: "",\n    isAlive: false,\n    coords,\n    siblings\n  }\n  mdl.board[coords] = cell\n\n  return mdl\n}\n\nconst makeBoardFromSize = (mdl, size) => {\n  mdl.size(size)\n  return range(0, size * size).map(makeCell(mdl)(size))\n}\n\nconst calculateCell = (mdl) => {\n  Object.keys(mdl.board).map((cell) => {\n    let cellsAlive = without([false], values(mdl.board[cell].siblings)).length\n\n    if (mdl.board[cell].isAlive) {\n      if (cellsAlive <= 2) {\n        mdl.board[cell].isAlive = false\n      }\n\n      if ([2, 3].includes(cellsAlive)) {\n        mdl.board[cell].isAlive = true\n      }\n\n      if (cellsAlive > 3) {\n        mdl.board[cell].isAlive = false\n      }\n    } else {\n      if (cellsAlive == 3) {\n        mdl.board[cell].isAlive = true\n      }\n    }\n  })\n  return mdl\n}\n\nconst updateSiblings = (mdl) => {\n  Object.keys(mdl.board).map((cell) =>\n    Object.keys(mdl.board[cell].siblings).map(\n      (sibling) =>\n        (mdl.board[cell].siblings[sibling] = mdl.board[sibling].isAlive)\n    )\n  )\n\n  return mdl\n}\n\nconst runGOL = (mdl) => {\n  if (mdl.isRunning()) {\n    mdl.lifecycle(mdl.lifecycle() + 1)\n    setTimeout(() => {\n      m.redraw()\n      return runGOL(updateCells(mdl))\n    }, mdl.delay())\n  } else {\n    return mdl\n  }\n}\n\nconst randomizeCells = (mdl) => {\n  let randomCells = Object.keys(mdl.board)\n    .sort(() => 0.5 - Math.random())\n    .slice(0, Math.floor((mdl.randomized() / 100) * (mdl.size() * mdl.size())))\n\n  randomCells.map((cell) => (mdl.board[cell].isAlive = true))\n\n  return mdl\n}\n\n\nconst initBoard = mdl =>   {  \n  makeBoardFromSize(mdl, Number(mdl.size()))\n  createSeed(mdl)\n}\n\nconst makeNewGame = mdl => e => {\n  restart(mdl)\n  initBoard(mdl)\n}\n\nconst advanceLifeCycle = mdl => (e) => {\n  mdl.isRunning(false)\n  mdl.lifecycle(mdl.lifecycle() + 1)\n  updateCells(mdl)\n}\n\nconst goForth = mdl => (e) => {\n  mdl.isRunning(true)\n  runGOL(mdl)\n}\n\nconst randomize = mdl => (e) =>{\n  mdl.randomized(e.target.value)\n  initBoard(mdl)\n}\n\nconst setDelay = mdl => (e) => mdl.delay(e.target.value)\n\nconst setBoardSize = mdl => (e) => {\n  mdl.size(e.target.value)\n  initBoard(mdl)\n}\n\nconst updateCells = compose(calculateCell, updateSiblings)\nconst createSeed = compose(updateSiblings, randomizeCells)\n\nconst Cell = {\n  view: ({ attrs: { mdl, cell } }) => {\n    return m(".cell", {\n      class: cell.isAlive ? "alive" : "dead",\n      style: {\n        fontSize: `${mdl.width() / mdl.size() / 2}px`,\n        height: `${mdl.width() / mdl.size() / 2}px`,\n        flex: `1 1 ${mdl.width() / mdl.size()}px`\n      },\n      onclick: () => {\n        mdl.board[cell.coords].isAlive = !cell.isAlive\n        updateSiblings(mdl)\n      }\n    })\n  }\n}\n\nconst Board = ({ attrs: { mdl } }) => {\n  initBoard(mdl)\n  return {\n    view: ({ attrs: { mdl } }) => {\n      return m(\n        ".board",\n        { style: { width: `${mdl.width()}px` } },\n        Object.keys(mdl.board).map((coord) => {\n          let cell = mdl.board[coord]\n          return m(Cell, { key: cell.key, cell, mdl })\n        })\n      )\n    }\n  }\n}\n\nconst Input = () => {\n  return {\n    view: ({ attrs: { mdl, label, min, max, step, value, fn } }) => [\n      m("label", [label,\n      m("input[type=\'number\']", {\n        inputmode: \'numeric\',\n        pattern:"[0-9]*",\n        min,\n        max,\n        step,\n        value,\n        onchange: e => fn(e)\n      })\n      ])\n    ]\n  }\n}\n\nconst Button = () => {\n  return {\n    view:({attrs:{mdl, label, fn}}) => m(\n        "button", {onclick: (e) => fn(e)},\n        label\n      )\n  }\n}\n\nconst TopRow = {\n  view:({attrs:{mdl}})=>\n   m(\'.topRow\', [m(Button, {mdl, fn: makeNewGame(mdl), label: \'New Game\'}),\n      m(Button, {mdl, fn: advanceLifeCycle(mdl), label:"Advance 1 Lifecycle"}),\n      m(Button, {mdl, fn:goForth(mdl), label:"Go Forth"})])\n}\n\nconst BottomRow = {\n  view:({attrs:{mdl}})=>\n    m(\'.bottomRow\',[\n      m(Input, { mdl, label: \'Randomize(%):\', min:0, max:100, step:1, value:mdl.randomized(), fn:randomize(mdl) }),\n      m(Input, { mdl, label: \'Delay(ms):\', min:0, max:1000, step:100, value:mdl.delay(), fn:setDelay(mdl) }),\n      m(Input, { mdl, label: \'size:\', min:30, max:100, step:10, value:mdl.size(), fn: setBoardSize(mdl) })])\n}\n\n      \nconst Toolbar = {\n  view: ({ attrs: { mdl } }) =>\n    m(".toolbar", [\n      m(TopRow, {mdl}),\n      m(BottomRow, {mdl})\n    ])\n}\n\nconst GameOfLife = {\n  view: ({ attrs: { mdl } }) => {\n    return m(".container", [\n      m(Toolbar, { mdl }),\n      m(Board, {\n        mdl\n      }),\n      m("h2", `lifecycle: ${mdl.lifecycle()}`)\n    ])\n  }\n}\n\nm.mount(root, {view:() => m(GameOfLife, {mdl:model})})'
