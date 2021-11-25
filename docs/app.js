(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("components/gol.js", function(exports, require, module) {
import { compose, flatten, range, without } from "ramda"
import { log } from "utils"
const SIBLING_COORDS = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
]

const model = {
  isRunning: true,
  matrix: [],
  delay: 400,
  size: 100,
  width: 1000,
  generation: 0,
}

const restart = (mdl) => {
  mdl.isRunning = true
  mdl.delay = 400
  mdl.size = 10
  mdl.width = 1000
  mdl.generation = 0
  mdl.matrix = []
  return mdl
}

const withinBounds = (limit) => (coords) =>
  !(coords.includes(limit) || coords.includes(-1))

const toSiblings = (limit) => (sibCoords) => (coords) =>
  sibCoords
    .map((sib) => [sib[0] + coords[0], sib[1] + coords[1]])
    .filter(withinBounds(limit))

const toCell = (key, size, rowIdx, idx) => {
  let coords = [key % size, Math.floor(key / size)]
  let siblings = toSiblings(size)(SIBLING_COORDS)(coords)
  return {
    key,
    rowIdx,
    idx,
    value: "",
    isAlive: Math.random() > 0.5 ? true : false,
    coords: coords.toString(),
    siblings: siblings.map((s) => s.toString()),
  }
}
const makeMatrix = (width, xs) =>
  xs.reduce(
    (rows, key, index) =>
      (index % width == 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    []
  )

const createMatrix = (mdl) => {
  let cellsArray = range(0, mdl.size * mdl.size)
  let cellsMatrix = makeMatrix(mdl.size, cellsArray)
  mdl.matrix = cellsMatrix.map((row, rowIdx) =>
    row.map((key, idx) => toCell(key, mdl.size, rowIdx, idx))
  )
  return mdl
}

const calcNextPhase = (mdl) => {
  let cellsArray = flatten(mdl.matrix)
  let cells = cellsArray.reduce((acc, cell) => {
    acc[cell.coords] = cell.isAlive
    return acc
  }, {})

  const getCellByCoord = (coord) => cells[coord.toString()]

  cellsArray.map((cell) => {
    let neighborsAlive = without(
      [false, undefined],
      cell.siblings.map(getCellByCoord)
    )

    if (cell.isAlive) {
      if (neighborsAlive.length <= 2) {
        cell.isAlive = false
      }

      if ([2, 3].includes(neighborsAlive.length)) {
        cell.isAlive = true
      }

      if (neighborsAlive.length > 3) {
        cell.isAlive = false
      }
    } else {
      if (neighborsAlive.length == 3) {
        cell.isAlive = true
      }
    }
  })
  return mdl
}

const runGOL = (mdl) =>
  setTimeout(() => {
    m.redraw()
    return runGOL(calcNextPhase(mdl))
  }, mdl.delay)

const Cell = {
  view: ({ attrs: { mdl, cell } }) =>
    m("td.cell", {
      class: cell.isAlive ? "alive" : "dead",
      style: {
        fontSize: `${mdl.width / mdl.size}px`,
        height: `${mdl.width / mdl.size}px`,
        flex: `1 1 ${mdl.width / mdl.size}px`,
      },
      onclick: () =>
        (mdl.matrix[cell.rowIdx][cell.idx].isAlive = !cell.isAlive),
    }),
}

const Matrix = {
  view: ({ attrs: { mdl } }) =>
    m(
      "Table.matrix",
      mdl.matrix.map((row, rowIdx) =>
        m(
          "tr",
          row.map((coord, idx) =>
            m(Cell, { mdl, cell: mdl.matrix[rowIdx][idx] })
          )
        )
      )
    ),
}

export const TheGameOfLife = {
  oninit: () => {
    createMatrix(model)
    runGOL(model)
  },
  view: () => {
    return m("#TheGameOfLife.container", m(Matrix, { mdl: model }))
  },
}

});

;require.register("components/hamburger.js", function(exports, require, module) {
import { isSideBarActive } from "utils"

export const Hamburger = {
  view: ({ attrs: { mdl } }) =>
    m(
      "div.nav-icon",
      {
        class: isSideBarActive(mdl) ? "is-active" : "",
        onclick: (e) => {
          mdl.status.sidebar = !mdl.status.sidebar
        },
      },
      m("div")
    ),
}

});

;require.register("components/header.js", function(exports, require, module) {
import { AnimateChildren, slideInDown } from "styles"
import { Hamburger } from "components"
import { nameFromRoute, randomPause, isSideBarActive } from "utils"

export const Header = {
  view: ({ attrs: { mdl } }) =>
    m(
      "#header.frow.row-center.justify-between",
      {
        style: {
          transitionDuration: 2000,
          backgroundColor: isSideBarActive(mdl) ? "black" : "white",
        },
      },
      [
        m(
          m.route.Link,
          {
            href: "/home",
          },
          m(
            "p.typewriter type-writer",
            {
              id: "logo-header",
              style: {
                color: isSideBarActive(mdl) ? "white" : "black",
              },
              oncreate: ({ dom }) =>
                (dom.onanimationend = () =>
                  setTimeout(() => dom.classList.remove("type-writer"))),
            },
            m("code", "{Boaz Blake}")
          )
        ),
        mdl.settings.profile === "desktop"
          ? m(
              ".navbar.frow",
              {
                oncreate: AnimateChildren(slideInDown, randomPause),
              },
              mdl.routes
                .filter((r) => r !== m.route.get())
                .map((route) =>
                  m(
                    m.route.Link,
                    {
                      class: "navbar-item",
                      href: route,
                      selector: "li",
                    },
                    nameFromRoute(route)
                  )
                )
            )
          : m(Hamburger, { mdl }),
      ]
    ),
}

});

;require.register("components/index.js", function(exports, require, module) {
export * from "./hamburger.js"
export * from "./header.js"
export * from "./sidebar.js"
export * from "./layout.js"
export * from "./walkabout.js"
export * from "./gol.js"
export * from "./snippets/index.js"

});

;require.register("components/layout.js", function(exports, require, module) {
import { Animate, sideBarIn, slideOutRight } from "styles"
import { Header, SideBar } from "components"

export const Layout = () => {
  return {
    view: ({ attrs: { mdl }, children }) =>
      m(".app", [
        m(Header, { mdl }),
        m(".page", children),
        mdl.status.sidebar &&
          mdl.settings.profile !== "desktop" &&
          m(SideBar, {
            oncreate: Animate(sideBarIn()),
            onbeforeremove: Animate(slideOutRight),
            mdl,
          }),
      ]),
  }
}

});

;require.register("components/loader.js", function(exports, require, module) {
const loader = m(".holder", [
  m(".preloader", [
    m("div"),
    m("div"),
    m("div"),
    m("div"),
    m("div"),
    m("div"),
    m("div"),
  ]),
])

export default loader

});

;require.register("components/sidebar.js", function(exports, require, module) {
import { AnimateChildren, sideBarChildren, slideOutLeft } from "styles"
import { nameFromRoute, randomPause } from "utils"

export const SideBar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "ul.sidebar",
        {
          oncreate: AnimateChildren(sideBarChildren(), randomPause),
          onbeforeremove: AnimateChildren(slideOutLeft),
        },
        mdl.routes
          .filter((r) => r !== m.route.get())
          .map((route) =>
            m(
              m.route.Link,
              {
                class: "sidebar-item",
                href: route,
                selector: "li",
              },
              nameFromRoute(route)
            )
          )
      ),
  }
}

});

;require.register("components/snippets/GOL/GOL.js", function(exports, require, module) {
export const GOL =
  "const compose = R.compose\nconst flatten = R.flatten\nconst range = R.range\nconst without = R.without\nconst values = R.values\nconst prop = R.prop\nconst root = document.getElementById('GameOfLife')\nconst log = m => v => {console.log(m,v); return v}\n\nconst SIBLING_COORDS = [[-1, 0],[-1, 1],[0, 1],[1, 1],[1, 0],[1, -1],[0, -1],[-1, -1]]\n\nconst model = {\n  isRunning: false, \n  matrix: [],\n  delay: 300,\n  size: 10,\n  width: 1000,\n  generation: 0\n}\n\nconst restart = (mdl) => {\n  mdl.isRunning = false\n  mdl.delay = 300\n  mdl.size = 10\n  mdl.width = 1000\n  mdl.generation = 0\n  mdl.matrix = []\n  return mdl\n}\n\nconst withinBounds = (limit) => (coords) => \n  !(coords.includes(limit) || coords.includes(-1))\n  \nconst toSiblings = (limit) => (sibCoords) => (coords) =>\n  sibCoords\n\t.map((sib) => [sib[0] + coords[0], sib[1] + coords[1]])\n\t.filter(withinBounds(limit))\n\nconst toCell = (key, size, rowIdx, idx) =>  {\n  let coords = [key % size, Math.floor(key / size)]\n  let siblings = toSiblings(size)(SIBLING_COORDS)(coords)\n  return {\n\tkey,\n\trowIdx,\n\tidx,\n\tvalue: '',\n\tisAlive: false,\n\tcoords: coords.toString(),\n\tsiblings: siblings.map(s => s.toString())\n  }\n}\nconst makeMatrix = (width, xs) =>\n\txs.reduce((rows, key, index) => \n\t  (index % width == 0 \n\t\t? rows.push([key]) \n\t\t: rows[rows.length-1].push(key)) && rows, \n\t  []);\n\nconst createMatrix = mdl => {\n  let cellsArray = range(0, mdl.size * mdl.size)\n  let cellsMatrix = makeMatrix(mdl.size, cellsArray)\n  mdl.matrix = cellsMatrix.map((row, rowIdx) => \n\trow.map((key, idx) => \n\t  toCell(key, mdl.size, rowIdx, idx)))\n  return mdl\n}\n \nconst initGame = ({attrs:{mdl}}) => createMatrix(mdl)\n \nconst makeNewGame = compose(createMatrix,restart)\n \nconst calcNextPhase = (mdl) => {\n  let cellsArray = flatten(mdl.matrix)\n  let cells =  cellsArray.reduce((acc, cell) => {\n\t  acc[cell.coords] = cell.isAlive\n\t  return acc},{})\n\t  \n  const getCellByCoord = coord => cells[coord.toString()]\n  \n  cellsArray.map((cell) => {\n\tlet neighborsAlive =  without([false, undefined],(cell.siblings.map(getCellByCoord)))\n\n\tif (cell.isAlive) {\n\t  if (neighborsAlive.length <= 2) {\n\t\tcell.isAlive = false\n\t  }\n\n\t  if ([2, 3].includes(neighborsAlive.length)) {\n\t\tcell.isAlive = true\n\t  }\n\n\t  if (neighborsAlive.length > 3) {\n\t\tcell.isAlive = false\n\t  }\n\t} else {\n\t  if (neighborsAlive.length == 3) {\n\t\tcell.isAlive = true\n\t  }\n\t}\n  })\n  return mdl\n}\n\nconst runGOL = (mdl) => {\n  if (mdl.isRunning) {\n\tmdl.generation = mdl.generation++\n\tsetTimeout(() => {\n\t  m.redraw()\n\t  return runGOL(calcNextPhase(mdl))\n\t}, mdl.delay )\n  } else {\n\treturn mdl\n  }\n}\n\nconst advanceLifeCycle = mdl => (e) => {\n  mdl.isRunning = false\n  mdl.generation++\n  calcNextPhase(mdl)\n}\n\nconst goForth = mdl => (e) => {\n  mdl.isRunning = true\n  runGOL(mdl)\n}\n\nconst setDelay = mdl => (e) => mdl.delay = e.target.value\n\nconst setMatrixSize = mdl => (e) => {\n  mdl.size = e.target.value\n  createMatrix(mdl)\n}\n\nconst Cell = {\n  view: ({ attrs: {mdl, cell } }) =>  m('td.cell', {\n\t  class: cell.isAlive ? 'alive' : 'dead',\n\t  style: {\n\t\tfontSize: `${mdl.width / mdl.size}px`,\n\t\theight: `${mdl.width / mdl.size }px`,\n\t\tflex: `1 1 ${mdl.width / mdl.size}px`\n\t  },\n\t  onclick: () => mdl.matrix[cell.rowIdx][cell.idx].isAlive = !cell.isAlive\n\t})\n}\n\nconst Matrix = {\n  view: ({ attrs: { mdl } }) =>   \n\tm('Table.matrix',\n\t  { style: { width: `${mdl.width}px` } },\n\t  mdl.matrix.map((row, rowIdx) =>\n\t  m('tr', row.map((coord, idx) => \n\t   m(Cell, { mdl, cell:mdl.matrix[rowIdx][idx] }) ))))\n}\n\nconst Input =  {\n  view: ({ attrs: { mdl, label, min, max, step, value, fn } }) => [\n\tm('label', [label,\n\tm('input', {\n\t  inputmode: 'numeric',\n\t  pattern:'[0-9]*',\n\t  type: 'number',\n\t  min,\n\t  max,\n\t  step,\n\t  value,\n\t  oninput: e => fn(e)\n\t})\n\t])\n  ]\n}\n\nconst Button = {\n  view:({attrs:{mdl, label, fn}}) => \n\tm('button', {onclick: (e) => fn(e)}, label)\n}\n\nconst TopRow = {\n  view:({attrs:{mdl}})=>\n   m('.topRow', [m(Button, {mdl, fn:() => makeNewGame(mdl), label: 'Restart'}),\n\t  m(Button, {mdl, fn: advanceLifeCycle(mdl), label:'Advance 1 Generation'}),\n\t  m(Button, {mdl, fn:goForth(mdl), label:'Go Forth'})])\n}\n\nconst BottomRow = {\n  view:({attrs:{mdl}})=>\n\tm('.bottomRow',[\n\t  m(Input, { mdl, label: 'Delay(ms):', min:0, max:1000, step:100, value:mdl.delay, fn:setDelay(mdl) }),\n\t  m(Input, { mdl, label: 'size:', min:10, max:1000, step:10, value:mdl.size, fn: setMatrixSize(mdl) })])\n}\n \nconst Toolbar = {\n  view: ({ attrs: { mdl } }) =>\n\tm('.toolbar', [\n\t  m(TopRow, {mdl}),\n\t  m(BottomRow, {mdl})\n\t])\n}\n\nconst GameOfLife = {\n  oninit: initGame,\n  view: ({ attrs: { mdl } }) => {\n\treturn m('.container', [\n\t  m(Toolbar, { mdl }),\n\t  m(Matrix, { mdl }),\n\t  m('h2', `generation: ${mdl.generation}`)\n\t])\n  }\n}\n\nm.mount(root, {view:() => m(GameOfLife, {mdl:model})})"

});

;require.register("components/snippets/GOL/GOL_CSS.js", function(exports, require, module) {
export const GOL_CSS =
  "* {\n  font-family: Montserrat, Sans-Serif;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  outline: none;\n}\n\n.toolbar {\n  line-height: 70px;\n  padding: 10px;\n  border: 1px solid #ecf0f1;\n  justify-content: space-between;\n}\n\n.topRow {\n  display: flex;\n  flex-flow: wrap;\n  justify-content: space-around;\n}\n\n.bottomRow {\n  display: flex;\n  flex-flow: wrap;\n  justify-content: space-around;\n}\n\nbutton {\n	box-shadow: 0px 10px 14px -7px #276873;\n	background:linear-gradient(to bottom, #599bb3 5%, #408c99 100%);\n	background-color:#599bb3;\n	border-radius:8px;\n	display:inline-block;\n	cursor:pointer;\n	color:#ffffff;\n	font-family:Arial;\n	font-size:20px;\n	font-weight:bold;\n	padding:13px 32px;\n	text-decoration:none;\n	text-shadow:0px 1px 0px #3d768a;\n}\nbutton:hover {\n	background:linear-gradient(to bottom, #408c99 5%, #599bb3 100%);\n	background-color:#408c99;\n}\nbutton:active {\n	position:relative;\n	top:1px;\n}\n\nlabel > * {\n  padding: 10px;\n  margin: 10px;\n	background: #1abc9c;\n	color: #fff;\n	font-size: 1em;\n	line-height: 30px;\n	text-align: center;\n	text-shadow: 0 1px 0 rgba(255,255,255,0.2);\n	border-radius: 15px;\n}\n\n.board {\n  margin: 0 auto;\n  border: dashed 1px #8e44ad;\n}\n.cell {\n  cursor: pointer;\n}\n\n.alive {\n  background: #8e44ad;\n}\n\n.dead {\n  background: #ecf0f1;\n}"

});

;require.register("components/snippets/GOL/GOL_HTML.js", function(exports, require, module) {
export const GOL_HTML = '<div id="GameOfLife"></div>'

});

;require.register("components/snippets/GOL/index.js", function(exports, require, module) {
export * from "./GOL.js"
export * from "./GOL_CSS.js"
export * from "./GOL_HTML.js"
export default "https://flems.io/#0=N4IgtglgJlA2CmIBcBWFA6AzCgNCAzvAgMYAu8UyIAhgA63oBW+Ie+xATgPayzIDaABhyCAungBmEBCyT9QAO2phESGvSYs8xLgvJ6qOhflIACAMqkO8ZadMBeU2HQnrygDoKjJ0zrC0uQgdTACV0PwDCT28zDmoFAHN4YLC4xPho3R8AdwhSAAsuAFczRzDcguLSTOMzADdqWCL4fBT0BqaWmp9ablo23q5abtiuLlLTKC5iIpU9dCTSAFEEOdIAIQBPAEkoAAoAcgBxZXgAeQkAGQgJeAOAShGLbfXL7YA5I4BhM7OQgBFzMF+PwALQARhwpjEODBkNM4PEQihiNh8NR-HhMMxUIhSOEpjxsIhuMRoiesC4CWCYAcAD5THV6aZgN4ePB0JSEnswDg6vcANymaykIocBSMgC+nieYC4UCIwWAnjsEHwISKCgUEESSAsVhsYD2EkahHuOBVpgARlxqBwoHr+OJLcQiLB8HJnRLrbb7QBBDhxTaOr12BWwajB-VuI2YQSCc2W-AQABe8D1lhje3BCYt3tyUAKGYNymz8dzlqSCngcVIEF0xazCc80oUT2sJjtEx5cHuzOV3rAcHQao1Wp13JN7vgj0Hw-Dkb2cebc9gLlT8DLs7sQ7XBYKZfj26cw6rNeodd0exXO+HNrtUGB5NX4TdrUcTstu-Q95T-sDkZPpaIpihKu4tjKXhZGYFT5Dq6zFAoUDvqYeywBAkCkH29gMnsOhcPa+DYQyloAIR4WMhEjl4TQKvgaEYXkfYAD7Mb4lHIdRxC0S0ewQvcx6QTEpikFw5gQFa6GJChu70gxmHEahyZWl8HFEcyFEEchxFJhJqlafglp2OgYB0HsezKYp-DKUIoimAA1OxBm2VCNmIg5TmEZioiiMexlSLA5AcHssHwYhyHyUxs6ytQADW8BfG6wQ9rAikWRuaXxZsikDnYCBmPhhHAllpgAKSmMmaZQgAshe+ToBIlIEXsJUAPQVRlz55fAZjKVJCQoaJ4mSRO9G7vc6VphN5gvG8nw-H8gITYV2mWvlvhJY4uV2KYWV5jtwpcNkuwAB56goRS8PtO3QGdpgXVdRmMo0zR6gcBzXaq+B+uhdTpqYU6EJ9nnIXqK34OgQ1WBOeyJt6dh9aNeqI9JJlme+DIQ1DHAwwJlqtnYIHihtvAQW2UG1E4cXwLV0Mncl+75FCJ3qThT0s+g1hQEUrrmdw2T4FCe2mDqConWlovwPT5WMw4jiCKYAD8h0C+gtBFPg+R7PwWW+aYT12Hq-P4PwxucvAiQFHiasa1rWUCaYABkjsq4LphOoKQnQb4bjkLTOP044sk4Sya09ST7oBkGwRpEk15Qt+lWbn2ABUJ5rknsP3GjtA8tTiW8ClE2JxuWfHt+972jS1P+xAJ0peuaaw1Crq8N9AHZcBPWgenZP6xTPg6nkJwqMlwAXlYHrALukqSopnA2H7F4B0XKoxfF7zwNkI-JI4ESBJuC8XjTy91zgHakF225PMQjTEJvJ2kAACvk1BBI4Rf9mHBVvlHgFlA1CMpB9AN0rlAY861W7umCBHduQZOYUB5puJ6exqDEGIC3N0OUDamDQcQfgUDwhqTsnvN0I5vq-QyPDHaRMJR4MlDgYAc8cEum9osAusAtj6SrnvDizIoEmxWpDMS0NEiwy6v3OwAi-6bBzuZKB2DqHrWrBABI+QbQcAoRAP6MDYJVG1oDeAUJNQKikNWKA4g8JkJRgNOR7C3RcI4gJaK1CbioUIWqH62iZyh2oaqCQqEVFqI0Vov65tLb5FMAAHkcAAJj7NtA6UiyGeMocEQxODWw4LcdrWJUJMCiC4jxeiQT1EEVCRyBAESHaJKSR4ipwQrDNEyZBJJIsAl7FKSErxYSqkJAKKYBkmAEk4OSbwchPTd4A1NFQtpBMdqSlMEQIItT-GBPgKospmjJnhP6ZE+wjhhm+LaXYXOUCoRdPKZMvydSUkNMcE02ZST5l2Hmcw70tDe4KCyQPWImojhnEuMlcaX9vQ5O-KOTU2oxE1Ket+M8tZ6wKAbgii8SLYYeXBDcwgpAAAqGF4D6IxSHVZTgEFQDiNkWGODPkcH+YCvCd8H7P1foQIuNyGHp3QAuTYWd8ZLOnMcmh3dibgW9K2H5wlqBQAaF4eA1xbhfE2NxKZwdcI+JJV+YckLxxiMMeXU8FtzyXmRfCo1iKrx9kclil0TKpYsrfpucaZMngJC4AAMQIgMoOcANIaoZNtCF6ooUw0eceOlCgAWXFXt8r2lMcX-CIP-dOfrFLfh5XsDkl8OCLHaC9GccafA4oQg+cSaYaS+pDpmxRt4M6lyzXaXNHRmjHiHqQHeexx7AM0UgaecBZ6zkld7DhSpLR1AgFvPUnbcHdo9Cyfmp0oS3QTnATBvBTCLLnsyJwhxSBQFfLwD6QqDrcTfnO+pkylamAOI0bxBxTBvQVNKj6OCTCbAQHqUldgJC6FIGW-6AADAAJH2vc0ADx9naiXJukHTCxMlLQE6AHgYHXyBstRpA9TAdA+gRmGKoPDkzrB+DiHkOjIBggO6AHwQIlMCB78eHYPQeTqYdqJGkOZJQ6YXQ3EIDEFilOtNd5fRQFNkdU6oh+C3UKak7xwRSIXsoU9d5Q7KYlp4ahYAM7J6fpTZumtwoRUSlqeOydmntM9pZHpjdik7A4KNAcXF1BJIcjAS+vxO0tNvo-VZxmWH6PDkYwhpDG6N1cdrT+ETci9j8yhAuqA4t6TkYc1YI9-NosrSXQlxS5G7BfqSZAzaXKwFieOglyT0ncs7Q8Ql4It0qtjLXPFwOKtTrkc+UaDhUJgDNayydNdsAhbwCjIQ4Wsl3lzKMs448ErC1mG2AodW3YDOfJMxO7IU6tMT0s1p3cUIIxWiIAnHUCdqD9YquQWgUJm1GIBhKfTzJ+D2cOAdogR7+CvcG89g4OoltHvy79kocoFRvQuioHGxB3MnNMLQCeNYFBIAOEIUEABOUQKcocnNIJsWg-0Dhg8OxwTHbTIAKHC1Tfr5GTDwCu+Rm75PdCA8w0s5kEhkUFo8xNpJvknoSNm+TYS6wSiiQlB-FbRnj2MnW0gTt22p57dMJ9qEbOB3MiNORg4Vphe6H+zx9C-Gp3+ru9Whh5HPs4Jmy635phcVDBCEdUd3pTMbdl7O3tM855s3hg54RtB7fZHe0aIXwDdDdYV2zmXabqab23qcIu+3nNEDeiEFo2bSAHDnlxoP2uycsnDwj3BMr4iugVQlZVCB4+K8T7ARHfoi9yto0cc1aKdeZ+e8HkXYfV13aQG6z1HADzjQT4dmvxwuCmH7wUDP9weexoF97BCIewD+8d3YZ3Muu06dAwOr3B0fc2iX-7j6T2PNGgW0t7r6dh9J+vYmiMvKwBEUR8dhHBJTJnRzPGVyl2kCf+u-mpAdNJNXlc0HvBNYAz+NvU-PYc-EoS-BXT7N6JOZ-JwHUX-N-M7dAgkanWgdA--ToQAwjUuUAiPCqHqdTKAf9SAmfQdNea3W3HgK0O0VfKXMzadOXXTcbGzJLahH3USRgu0d7Z7W3P3I6LvWAKAknPYRfUSZfMQvPftG5WfVTHwHeC4UvFgxnbUZnNtHea6dfczDgqzLgrdTVahDrQ4IhPQagHUGsIQ6Ahg2AJgjgeA31SQpJIPETVw2AGzLPQ4fIWJI9ADVFE1PUALNcEI9Fe4SUADJQy3OfTwZwOUTUUgGLMYUgbrdfYlBkI0NQq4G4W7UDQA+UIgOeOeVgEACIaQGsKgJgkfCowgEgE1WQEAQQJAQQUEWJWJFAVAAAFhAAYUUFOCoG8w5GIHwC0EqN-QtlICoDTm2h-T0FBBNEgFgCjGql-UIAAgyIsHiHwFBHMBrBuAFEtFBGyHgCtFijyFBBtBOlBEqgnD1A0QVA4BuK4BOhOO9FBDlBTDeLuIeN1B9HtBrD+M+LsFuPuNTEeKBJeNBMtCqCkn+gUF0HgE+J+WEQEI4CFURNBDQ02WZwAHZBBEMwSYdpUoBoScwSTLRniaw9RwREMKoeBoBTAABieAYgCQQQCQcEUkxgDWOsCQTYUEIwfQZnfAWHV0G4nqc4i2NEyCX3FfbaCkiU+-PURqKWUkjUu4xqI6PUbIOIWgPkgUm4YU0UmY5GSU+AUEO0cKeU8mSLQ-B3ZUtUWgNUijTUy0bU5YykDbUwA0ugY0kwU0kU6YvQS0tBa020kxe0zwLXEPYzGUUgCEzWaVPU6ERkqk+mcEXoxk0EAkxk1k2JAkgANgAA4CTMBPj3Bky0FYoEhuATEkBES7RQQGzpUJ09A9hRIfQl8oRWSUAUcUcrQrRMBTAUBSp+zejBAyziAhyER4xSpPY2xaz+MGzwpQzKQOAkAByhyRyqykzaTXi4gKSNYkAyzqSVyVS3TIwkAdQcTJJphYpqzSAZhNECIkAAgdQgoXydAtydyJBAKgKXzFjSBljlBpBgwAwIBGgQLf1IS0wkBYliSPikzQKzj0N8hMMbRYAoAXzYcYBHjwRMBGTMBYlLyazyBH5QQFQdALUEdkTqwXyqKwLUypgNsUKERGTOLWTMAoBSyyzqB7T4yRckBCg-osSBwaymC1zGykJmzbDWz2yKSZjuzx8D9ZCpyZy5yUdxzJy2TBzhzRyFzBAlyXyZL6y5KoBNyPzWTpzZyhzhKc8kA0E6wdEpLSBIg8gkUkBrAgFvFmKhhf9LyflPtBlTB5jLQCKKTASszSTTIc00CFyKLVzLLwo9RWTwRnM5ziBfyeAPy2TgK0L4LkCER4AwAXycS8SMM9Q4wUqWKbT0IEgC9XQ9AaxmL7V7jX52K9QFYGT6YFYc0mC9hujcBRqcBxrBB0B4lzKtIQSTyIAzyEQUAQqFSwEhUEqEgkqFZqASguBSSjy9QoA340NHx+q2Syz4BejejpV7SD0fDto3z8ACqvy2qOBYyFB0Bb13KaS6z1ymyLqrqbq8KrduUbBHxtoLL-r5K2SOSuSeS0SGiiAOTmiqA2iOiCSCTf8BjGEQAlAVAqBJYTp0AsKwA+BtAwzZi1AokKSmRoB7B3AQA8jS9Ga6QolWpaa6QBjxAQApJYpZB5A8bhi1BMJ8gcZyaQAxQ+A1AsLPKPRWpWpNRaB6yiEwBWpRbxaKjsdccRjOAIBaBZjBihaCa1A4ghxqAKipaqBZbaB5bFbFsVa-BWozbjqAABKa2JEs9AcEDmtUUgZ25QY6kyHUTQLWnHVQAgPWg2nGoYk28APIMW6Qe4ksMAS2jgaWkAG2u2pWx2rgNWjWpO1wQ0V22JdAKawQVqIu5QUOvAbWiO9gHGaOyUUQSUIAA"

});

;require.register("components/snippets/SHAPE/SHAPE.js", function(exports, require, module) {
export const SHAPE =
  "const valueToPoint = (value, index, total) => {\n  var x = 0;\n  var y = -value * 0.8;\n  var angle = ((Math.PI * 2) / total) * index;\n  var cos = Math.cos(angle);\n  var sin = Math.sin(angle);\n  var tx = x * cos - y * sin + 100;\n  var ty = x * sin + y * cos + 100;\n  return {\n    x: tx,\n    y: ty\n  };\n}\n    \nconst statsToPoints = (stats) => {\n  var total = stats.length;\n  return stats.map((stat, i) => {\n      var point = valueToPoint(stat.value, i, total);\n      return point.x + \",\" + point.y;\n    })\n    .join(\" \");\n}\nconst update = stat => e => stat.value  = e.target.value\nconst remove = stat => stats => stats = stats.length > 3\n      ? stats.splice(stats.indexOf(stat), 1)\n      : 'Cant Delete Anymore'\nconst add = stat => e => {\n    e.preventDefault()\n    if(stat == '') return\n   stats.push({label:stat.toUpperCase(), value:100})\n   newlabel = ''\n } \n \nconst stats = [\n    { label: \"A\", value: 100 },\n    { label: \"B\", value: 100 },\n    { label: \"C\", value: 100 },\n    { label: \"D\", value: 100 },\n    { label: \"E\", value: 100 },\n    { label: \"F\", value: 100 }\n  ]\n  \nlet newlabel = ''\n\nconst AxisLabel = { view: ({attrs:{point, stat}}) =>\n  m('text', {x:point.x, y:point.y}, stat.label)}\n\nconst Polygraph = {\n  view: ({attrs:{stats, points}}) => m('g',[\n    m('polygon', {points}),\n    m('circle',{cx:100, cy:100, r:80}),\n    stats.map((stat, idx) => \n      m(AxisLabel, {\n        point:valueToPoint(+stat.value+10, idx, stats.length),\n        stat\n        })\n    )\n  ])\n}\n\nconst Controls = {\n  view:({attrs:{stats}}) => m('', [\n    stats.map(stat => m('.',[\n      m('label', stat.label),\n      m('input',{type:'range', oninput:update(stat), value:stat.value, min:0, max:100}),\n      m('span', stat.value),\n      m('button.remove',{onclick:e=>remove(stat)(stats)}, 'X')\n      ])),\n      m('form#add',[\n        m('input', {\n          oninput:e => newlabel = e.target.value,\n          name:'newlabel',\n          value:newlabel}),\n        m('button',{onclick: add(newlabel)},'Add')])\n      ]        \n  )\n}\n\nm.mount(document.getElementById('ShapeShifter'), {\n  view:() =>\n    m('.#demo', [\n      m('svg',{width:200, height:200}, m(Polygraph,{stats, points:statsToPoints(stats)})),\n      m(Controls, {stats}),\n      m('pre.#raw', JSON.stringify(stats, null, 4))\n    ])})"

});

;require.register("components/snippets/SHAPE/SHAPE_CSS.js", function(exports, require, module) {
export const SHAPE_CSS =
  "body {\n  font-family: Helvetica Neue, Arial, sans-serif;\n}\n\npolygon {\n  fill: #42b983;\n  opacity: 0.75;\n}\n\ncircle {\n  fill: transparent;\n  stroke: #999;\n}\n\ntext {\n  font-family: Helvetica Neue, Arial, sans-serif;\n  font-size: 10px;\n  fill: #666;\n}\n\nlabel {\n  display: inline-block;\n  margin-left: 10px;\n  width: 20px;\n}\n\n#raw {\n  position: absolute;\n  top: 0;\n  left: 300px;\n}\n"

});

;require.register("components/snippets/SHAPE/SHAPE_HTML.js", function(exports, require, module) {
export const SHAPE_HTML = '<div id="ShapeShifter"></div>'

});

;require.register("components/snippets/SHAPE/index.js", function(exports, require, module) {
export * from "./SHAPE.js"
export * from "./SHAPE_CSS.js"
export * from "./SHAPE_HTML.js"
export const SHAPE_URL =
  "https://flems.io/#0=N4IgtglgJlA2CmIBcA2A7AOhQFgDQgGcBjAJwHtZZkBtABl1oF18AzCBAm0AOwEMxESEBgAWAFzBV8RMtzHw5yECAC+uHv0HCAVp2mz5ioTO4ExAAgBuvWAFd4AFTIAFMhDnmAvOYAU1u-C45u5Q8AAeQWJkYjYAlF4AfObAADrc5la8JOZhXua0ANxpGdbZAJ55ALT+9uYAVPkYABxF6ZnZvNwA5gh5Pj4AsrxiIhjOAJL15gBM8QD05lExsPENIeGtJVnmMgR5QyMYuz6dPfCxm+3mBO77w6M33CfdCBfFV2K53rkNu+aV5gqDUe5gA1OYAIy0QrvUqLCrfKYg8FAnZkPbgqEwtokeBiWwkdKpNoZMJIRYRd4ZMrksRld4qVoqKnmNImMzXGJiAhOVzubl9MzDAjxTxJYlbbJLGx5IXcjAIbojS64-GEznCjBgXgAB36cqCEFF4pZkvMOrcHm8NUcLktYh8cowNsNkWicUuGQyqoJ6Qt-IwuXBKRAuBDYPN9owZU95hUsRZGG0lp84ZDb24zO47Isth1UGG8FlXMS5iLYo1YmdNlqeXgGBiJC6eOrATZsg5uLAZEs5crpblewrg+LmsVXRG5iSAGZTeYAPyVggYAg62AQIjwR1c5frMIAeRY2+GsSCEITJK95IA5ABhToWAAi8AQ8nMAEFuGVu7jr+3TBYvAwKOFgVuWJqXvWOq4r2cjPiwvC2LADoXl6wRHnKXjeNe17xD6hJUoOGA6rYBAiD4wCwLwABGL5IE6UQAKo6jq8AkPeBBbqemQBEgWLxlS3DwAA7lRtGwHkOHFCorLpP+HIjt41AssA5hiXRrIgO+IZBDa5JYnGYaXqp6mwOSIYAEI6Tx9j6dChkqWpNEaSGt7WXpkL2WojmmeZICPu5NbwHZtAOcZTniX5ACigW8Z5oXeeFvmaQAYrFtnxXG7yMO8aSvuYQmic5EnYX+3DyRY75hBABAADLFXkqmWBAInkhRwxiCQBBIMA-pyEEcoqPGiTvGAPjXvIYRiNeQTAGSfVVhEgJIAt0ZqJWCrFbEWYVeYriwGUXQkLqIiNbCLXCW1wAdV1PWDkEC0EENxrmGN15dDNymXm9FoHV0sgzckj3xkZaFvUQEAkEQCAzcARBkliQREDSiPmCQSBNLQIMskR2p6seYiGlAYQvXOY1VTV9XibNc4ZAtSA2ry9o+KCTo2qCUJE0tRHjiMp605WAsCZeqHmIwF47dmHYWLeBjkLAQ7JOdrXtWInXdcAg7PaWb2A19aG47qBM6+NGCfWT42mYDTqmfzl4ZG97gkdN6h0qxSDXsd3TwIDshO7YYhIHmBbyAT3F6WzQVBJA3BIPQr28Aj0LY-br3jaunTW1yrb2HbaEO+N1EB1E3AYF2PY++osjQxuADWSDwGK5e9mHBMiut14ABq4XO4t5-nb0sGQJBgAAxEBUDm6nBfXv7LtK9PXp+9wzsN6WhWmXWDZZM2VYugLGR8AIHsb8VM0HzZwWn+JKf516b1F2rANV9m65EPX5gTz418vttuDXu+GAuFxa9zvhkd4Es0hpDAFqMgtg5A+CgGQIgtgBByAwNRMgUAyg0zaM1FWxoWRvQwKPUI3Y9YW2vAQSwH11DCWgCMJA0xoRBBEPACAXRxBMOTtHHw+1DrHR1CIdQ91Iz8m6oOJm4i27bViP3MGPhZZyHlgQWaWt5H33GtBeso9jrCUBgAKQAMr7gAHIrk6u4LoEAWBlDbkEbgSFYBBGwHIlk4t4yhhADIMAOp2BsSUNRYqXjOIICIGICAHYlAQgAKx8VUOoEAR8tBHAIHobxBgFBiECVgioEpzBDzkJUBCkADrkgABIvl7BEogvBzCmPgPYII74SAQBsANToBBKicVaSwJkUCV4UEOrIBeGQ2CUHJKPbA0xqIAE4mjTkuGQHUvAIZ0nJLQDAaAYn9PKtmSG0Miz5PGWZRYXsM64jkJcMw5Ba7BXMKPWZTzdlpEmhYY5Bhin8HYDScwlTYDVI3HUhpTSPytPadcTp3S2I2MuIUsQ3SIAAC97lQh1GEOF7BTmjxQLil53BN75KgDVNcvBfnuHXEJSo1FYDINrpcbUTZ3CVAQCwQOnl0WXHoVARhMxaCcrSJLXRvBhKjMjDcCJshyQ0QIBQAO8BLhRB1Bsy4rL2XTmhAKzMaQQkvngOEyJpglC0DjpUacEI46qGYCASltdOBIGoBoAQShIAjFaVIEABIqBCHEGIHU3U5hzHgTqWuXQjhkDAHMV1Ih3UAAFpgYE2dgKNEA3XsC1O4JM6S3ZaGIK0nU2SVCMBUEAA"

});

;require.register("components/snippets/TTT/TTT.js", function(exports, require, module) {
export const TTT =
  'const getRandomInt = (min, max) =>\n  Math.floor(Math.random() * (1 + max - min) + min)\n\nconst players = {\n  true: { score: 0, mark: "X" },\n  false: { score: 0, mark: "O" },\n}\nconst boardSizes = R.filter((n) => n % 3 == 0, R.range(0, 60))\n\nconst getDiagAcross = (acc, set, idx) => {\n  let r = acc.concat(set[idx])\n  return r\n}\n\nconst getDiagDown = (acc, set, idx) => {\n  let r = acc.concat(set[set.length - (idx + 1)])\n  return r\n}\n\nconst winningSetBy = (mdl) => {\n  if (mdl.size) {\n    let spaces = R.range(1, mdl.size * mdl.size + 1)\n    let setsAcross = R.splitEvery(mdl.size, spaces)\n    let setsDown = R.transpose(setsAcross)\n    let setsDiagAcross = setsAcross.reduce(getDiagAcross, [])\n    let setsDiagDown = setsDown.reduce(getDiagDown, [])\n    let winnings = setsAcross\n      .concat(setsDown)\n      .concat([setsDiagAcross].concat([setsDiagDown]))\n    return winnings\n  } else {\n    restart(mdl)\n  }\n}\n\nconst mdl = {\n  winnerSets: [],\n  winner: null,\n  turn: true,\n  players,\n  board: null,\n  size: 0,\n  width: 800,\n}\n\nconst markSelectedSpace = (mdl, key, mark) => {\n  const space = R.filter(R.propEq("key", key), mdl.board)\n  let updatedSpace = R.set(R.lensProp("value"), mark, R.head(space), mdl.board)\n  let index = R.findIndex(R.propEq("key", key))(mdl.board)\n  mdl.board = R.insert(index, updatedSpace, R.without(space, mdl.board))\n  return mdl\n}\n\nconst markRandomSpace = (mdl) => {\n  let emptySpaces = mdl.board.filter(R.propEq("value", ""))\n  let AISpace = emptySpaces[getRandomInt(0, emptySpaces.length - 1)]\n  !mdl.winner && AISpace && markSpace(mdl)(AISpace)\n  return mdl\n}\n\nconst updateTurn = (mdl) => {\n  mdl.turn = !mdl.turn\n  return mdl\n}\n\nconst isWinningSpace = (mdl, key) => {\n  let value = R.prop("value", R.head(R.filter(R.propEq("key", key), mdl.board)))\n  let sets = R.groupBy((c) => c[1])(mdl.board.map(R.props(["key", "value"])))\n  let keys = R.keys(R.fromPairs(sets[value])).map(Number)\n  let isWinner = mdl.winnerSets\n    .map((set) => set.every((key) => keys.includes(key)))\n    .includes(true)\n  return isWinner\n}\n\nconst checkIfDraw = (mdl) => {\n  if (!R.pluck("value", mdl.board).includes("")) {\n    mdl.winner = "No One"\n    return mdl\n  }\n  return mdl\n}\n\nconst markSpace = (mdl) => (space) => {\n  let player = mdl.players[mdl.turn].mark\n  if (isWinningSpace(markSelectedSpace(mdl, space.key, player), space.key)) {\n    mdl.players[mdl.turn].score++\n    mdl.winner = player\n    return mdl\n  }\n  checkIfDraw(mdl)\n  return mdl\n}\n\nconst nextTurn = (mdl, space) => {\n  return R.compose(\n    updateTurn,\n    markRandomSpace,\n    updateTurn,\n    markSpace(mdl)\n  )(space)\n  return mdl\n}\n\nconst restart = (mdl) => {\n  mdl.winner = null\n  mdl.size = 0\n  mdl.board = null\n  mdl.width = 800\n}\n\nconst makeBoardWithSize = (mdl, size) => {\n  mdl.size = size\n  mdl.board = R.range(0, size * size).map((n) => ({ key: n + 1, value: "" }))\n  mdl.winnerSets = winningSetBy(mdl)\n}\n\nconst Space = {\n  view: ({ attrs: { mdl, key, space } }) =>\n    m(\n      ".space",\n      {\n        style: {\n          fontSize: `${mdl.width / mdl.size / 2}px`,\n          height: `${mdl.width / mdl.size / 2}px`,\n          flex: `1 1 ${mdl.width / mdl.size}px`,\n        },\n        onclick: (e) => !mdl.winner && !space.value && nextTurn(mdl, space),\n      },\n      space.value && m(".value", space.value)\n    ),\n}\n\nconst PlayerScore = {\n  view: ({ attrs: { player, mdl } }) =>\n    m(".score-card", [player.mark, ":", player.score]),\n}\n\nconst Toolbar = {\n  view: ({ attrs: { mdl } }) =>\n    m(".toolbar", [\n      m("button.btn", { onclick: (e) => restart(mdl) }, "New Game"),\n      Object.keys(mdl.players).map((player, idx) =>\n        m(PlayerScore, { key: idx, player: players[player], mdl })\n      ),\n    ]),\n}\n\nconst Game = {\n  view: () =>\n    mdl.board\n      ? m(\n          ".game",\n          { style: { width: `${mdl.width}px` } },\n          mdl.board.map((space) => m(Space, { key: space.key, space, mdl }))\n        )\n      : [\n          m("h1", "select a board size"),\n          m(\n            "select",\n            {\n              value: mdl.size,\n              onchange: (e) => makeBoardWithSize(mdl, Number(e.target.value)),\n            },\n            boardSizes.map((n) => m("option", n)),\n            mdl.size\n          ),\n        ],\n}\n\nconst GameOver = {\n  oncreate: () => window.scrollTo(0, 0),\n  view: ({ attrs: { mdl } }) =>\n    m(\n      ".game-over",\n      { onclick: (e) => restart(mdl) },\n      `Game Over ${mdl.winner} is the winner!`\n    ),\n}\n\nconst TicTacToe = {\n  view: () =>\n    m(".", [\n      m(Toolbar, { mdl }),\n      mdl.winner && m(GameOver, { mdl }),\n      m(Game, { mdl }),\n    ]),\n}\n\nm.mount(document.getElementById("TicTacToe"), TicTacToe)'

});

;require.register("components/snippets/TTT/TTT_CSS.js", function(exports, require, module) {
export const TTT_CSS =
  "\n* {\n  box-sizing: border-box;\n  font-family: 'Mansalva';\n}\n\nselect {\n  width: 80px;\n  height: 36px;\n  font-size: 30px;\n}\n\n.toolbar {\n  border: 1px solid green;\n  display: flex;\n  flex-flow: wrap;\n  justify-content: space-between;\n}\n\n.score-card {\n  padding: 10px;\n  font-size: 30px\n}\n\n.game {\n  display: flex;\n  flex-flow: wrap;\n}\n\n\n.space {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid green;\n  cursor:pointer;\n}\n\n.game-over {\n  position: absolute;\n  top: 15%;\n  left: 15%;\n  width: 500px;\n  font-size: 90px;\n  background: #bdc3c7;\n  padding: 4px;\n  cursor: pointer;\n}\n\n.value {\n  font-size: inherit;\n}"

});

;require.register("components/snippets/TTT/TTT_HTML.js", function(exports, require, module) {
export const TTT_HTML =
  '<link href="https://fonts.googleapis.com/css?family=Mansalva&display=swap" rel="stylesheet">\n<div id="TicTacToe"></div>'

});

;require.register("components/snippets/TTT/index.js", function(exports, require, module) {
export * from "./TTT.js"
export * from "./TTT_CSS.js"
export * from "./TTT_HTML.js"
export const TTT_URL =
  "https://flems.io/#0=N4IgtglgJlA2CmIBcAGANCAzgYwE4HtZZkBtdFAXQwDMIFNTQA7AQzESRADoALAFzDEM2fEz7wxyEAB5YEJgGsABD1zxqAXgA6IfnwAOmJAHpj1UX0xcA5vnzWELfRCsiwx7JkwB+amzoAnhoAsixMmCywAG4sAGRQLvqwLEGYAO5OOkpqsNpYfAH0PPDwfDoAfCAYmPAI2HwQogycKEgArABMALStAGwoIAC+aMxsHNwAVgzCFhJ8UiLhfErWpQBKYVD4YACSYkoaSgAUkExoSmAsAB4AlAflSqF8PFzUsHa4R08vuJvbR3cAFTHACMSgA1Bdrkouhd5HdIacblomCjFphlkkUvBcJgDkpgCilEo+LgAK7wJAEnD4NSoc6XXAKKkAcgAGiylMMiUo-LAalTgDS6Up0FCmayAPIs7lMQZoprLABG+BYuCgAGUIAAveB4w5rV50cSfI5MO4aB5MJQAUiUAGYDocUEo0IbfkxVkd0P0bsjUQH0ctVnwACIQFjWACCeHwXgORxY2Gw5xqfHO0Fu9wJPIQy1w+KT2C4i2wLD4RzTJEzFH9xLUfDJuGtuBR8sDipWpXDkdD+DS1o0ieTqdKGagWctOetSjz2ULyZLojLFaraa4CE9zxhx0zEKUIJutZ5DabLbbKIVSyUaXkTHk1g1pQAQgF8WA4NnCTOINQTnAuEwHV4DuYBiWJHliTnTB9CTPV8XdMIvRBc5-1gQDgKUYEP3QoDdX3Q863A6DSkwGMCHjA1AKSCA+AAUSiHEAjQjDdVTWDsD1IioNKJQ00wPsBwQrhSTCGC43gStSPIuNMG42deP4nto1jSi+Ok1SrDUKAyU4o4Q2UmSvHOEhjxnHjliUiNrEEwd1MsWyuG03TJIM6zbJMszwIU5ZbyYe9PX1eyyM0pcmBXKSHP7c0woikgrMjIzMAoWLyyOeLSOU2za3k09mxvO8H0wHlBiUWoamnby1AxNUKxwoj23bK8MQuT9Dm-Yk-KYHEn0sJBTLQHkupxJAmDJIhBpnRtmypUkKUm4ksQCHFMHOHkVTVKBRvG2AFr44CqXQIboGeKkAA4UBQC8O2vRkFCfOpxE1Dj4HxNDzgUeAAgZNUFAtB4OqUIM+Je4TaFgE0jkNfQCH0OiAEcjhZT6AhZD6vpuNAcK4Db1SIucyX0KBy3gZ64OEtMoY3CRMAABVhpGYlgCkWUxu7zkNYoWCgSsXsx1r0NxqB8d4+QoHgK4wbFvZxauKmYfwOHEeRr60ZRv0WKFojsaF-ElENeQalwCsxYltBCeJp6NRet0uFvZ58DJVcbZ11U8aIvLrRw67muWO6NiYLYwGt8nDhwr9c14+AwH0AoQ84oLXc2o0IZxeXYYRxnIhZtAWVZkXlijHZ49ew5o9jgIS8wEgQwDoO9grMVy7jl6rE3axt1hQ8KB5ABCbHhoLWJYiUIuS6UYfxXul60JuI4x75k9SjPAWffCzsLZJgAVFew7agGeWx6a7P7gDj6X4+BYguVL3X68XAAdUKz1x8Od6lHViOZznJmKWEhX9BZ2ZvANGnN4DcypuDSG0MM7KxRmjD+GMsYAS1n6SOllSLCWsAQQmr4jjYGzNgEgIJayazdlALglxAEwMVpgdKKtUa51-iAnKBdEEBCCoaFGdDDTUAIGAWmLAIC4kitXZhOVKFOCOAAOTJGAJUOI2GPzvDid8AFB69SsFQyK2Z1zwEYrgZiKNszcK4PIbAzNxZ0PVn6Mx4VLF6iOHNECF8V7KP8jiNewNsDFGwAoHY1BQy-DSGo2AX9iS-iOL3aGzM-FAJzknPGdiLFkisUjfOlVwIDxUQWQ4LJpH4CUJKbqnIlCQWyMvfK3tzLtnAp7VeN8botTuq-K+U4YKhwBtfCySglqqL3uhPpuISBHzPClO6PJInuICo+GeLTajwHqKTEu78OmcS4Cjc4vTkjLVwPzNZ8ANkY1AuU7GQzq6jObClYUr1wTglOeonJ+IhnlPqdU4ktSga+P8YE4Js9XFVLgF4zs3Urh8B3vlQ4xwcLsTgv9TJ9TDRuH0BJI4m9xAQrOGU8yU867bBLntYk6L4CYsJVPFZ9U9pzwOR7SpXsgWNN9hUmqxtQnhIFnbJ5hwxpEEPgBPCpdRR8sFuQ-EPLYDCs5VAbchwLpXUZXfZpLBPrPnIU-Z4Wp8JvxhftXU8LAbYwFfiAVkrdZUQ9F6dARrgQCpuJIwBg4HhHGACjKk1pIQoSUMw1kMo0EzmyR43Amj8RdQfL1PB9VgXXlaYDKIEB4BpCpM68spIjDAB1ZskGcFBiDH+pBMASNqJwQQYDbyGJCiUlLd5XkFhNWUgAAYABJgAsVvNKngxhDXARuMYDogx9BXHrWS7yxQIDWH4FSJtLbsnts7fy7tvb+2DuHbyBAVwkD1rBGCZtM7nhztwsBJd9bZTVqUMuOQfiqSlweKfdCg8J4j17gcrgzCH1KFBeCs8qy+Ynurc+19k8C0shfdnEBsL1nML9U1AMTLaY7J6iINQ+Iq1xoTUoJNwAU24iQMAIZDI4A5vhUBwCiH4BdDLOqBBJAhmSKZLnJACCaM3LMtB4GW87CwCVGqZDPJUOJuOJhvgqacM4UI-cU5ha+Aca47gKj5TiRAaVE7KTTAcZ8CYGjYA56ICXrKtmaqfBaqz2GEofJaGADiYxWZkslEqCYiy+BHI4Sxc5drtFHDw0oTMeacUKaOHB7EQbSPnBdV9JAmZzhDKpOc6j8HcBUAFrm+SLHb7A0s+wHjM4+NJvhQ8kVm0lDeAuIW6wVmQvloQDhttp0p27p4EenN+H8vqntUcXmcLszyeKwSgkrrn2ZoOU13NSg-WnqpCQYrLIeAgjRiyGoj0lAsCULrAV1muveSA-NhzJbvVdrYme8KPAkKUj01OS4Kq1W0R4HW9+sj5Fp0OYZ3AIYQPAL9L+09xIhZ1q0VIx1k3FYNFEAg80mN1tZPnXqnuCq0tjElAYzLxJlxqBJjl7MfkthpBIwQIg7HvRoBQGDrL8b+PJqE9h9NBHhuWgk8B0r7Auj4AMSW7Tl7r3Mqe3VOANwTP1vS69eHqid2PMDaVFwJJigFUDb3et-pWOdi3jpreSZ2OCtjSTpAAJszEbk-6o47HCAyZC6JonCmRfdSHiPAt-PBe4GNwR03xX+f29gLmlEKWYNMDAJQx2YgjhbGwHIuYON8BQG+koRX2BldR-wCBKoIBkV0BxFILjCihBYAWfURo4QpAghBL0JAHQQRDBGCAVg7ApAli8PHxY4hJCcBRMCQGKorhdDwg+KkKp1Q4i6C3gA3DycwYguh+EgLAAIrJQjhEiDEFkA+FVbfqJk6rPBzooAHfP4ko7x18CpPaXoG-B8WDbwdB06+rjz+gyJaT3Hm+0nFrgKkIIB18UINAFYagJCb6UAkGCOyqRvASzf6AGt5vD9hUhpC-D6Df4TBkgYi-gBDkazBiBUgHK96lBpAlBMCX63wka0hkYUZQCZKwQwAd4Hjn7AHH4Cp77n5rw2BjCZK-5LQAFrrAFroj7vD8aQFOA4Ge5FqcSMGJD-6rpAE8iRBjpMBdC0TRxGBAxzA4gwFwENDUCIG15zBUicRiAKHrT34jQHgv6YBv5EHYJYHf6B64i0hIAoryAmi8Eoj0EM5M6qKAwopARA5MBUgsBKiGHMziDf5Sb6BP5tA2jf4IDUC74HjBHf4r5UhtCXSH4zhD58An66hUgACcFB60SYCg2CvuW0SgAAxEqFANgPaNgAAOzf4kEJCehUgAAsCRxI5hhhj+vS+ANh2hCqr2f8gMSRKRJ28gxQuAtEl+8ei+7hzQIAdRBeIIZ0QwVAIAcgigzQJAowFenAkAzwwx6eTYxAnAeghgJgxgZITA+gORS47gmxqgdAAAAh0FwCgFwHUZ2ldtsZQvIFwFMPHgUPoOMDgMMbHCXmseML8B+CwPHrsVIAcUYKYCcWcdYBccYKCcTDcY8R0L0FwCCMYL-nwEiWwMTO8apl8RgD8X8XgBAICcMMCVIFcdsW3qSOAmABCbgHsboEJocbCacecW4C8VsXQPSSjmAHcQ8Q8cYBiIKZ8dMCAKSVIP8RSfMIMBQIMEAA"

});

;require.register("components/snippets/index.js", function(exports, require, module) {
import { TTT, TTT_CSS, TTT_HTML, TTT_URL } from "./TTT/index"
import { GOL, GOL_CSS, GOL_HTML, GOL_URL } from "./GOL/index"
import { SHAPE, SHAPE_CSS, SHAPE_HTML, SHAPE_URL } from "./SHAPE/index"

const MITHRIL = {
  name: "mithril",
  type: "js",
  url: "https://unpkg.com/mithril",
}

export const TicTacToe = {
  id: "TicTacToe",
  title: "Tic Tac Toe",
  url: TTT_URL,
  code: {
    files: [
      { name: "app.js", content: TTT },
      { name: "style.css", content: TTT_CSS },
      { name: "index.html", content: TTT_HTML },
    ],
    links: [
      MITHRIL,
      {
        name: "ramda",
        type: "js",
        url: "https://unpkg.com/ramda@0.26.1/dist/ramda.min.js",
      },
      {
        name: "mithril-stream",
        type: "js",
        url: "https://unpkg.com/mithril-stream@2.0.0/stream.js",
      },
    ],
  },
}

export const GameOfLife = {
  id: "GameOfLife",
  title: "Game Of Life",
  url: GOL_URL,
  code: {
    files: [
      { name: "app.js", content: GOL },
      { name: "style.css", content: GOL_CSS },
      { name: "index.html", content: GOL_HTML },
    ],
    links: [
      MITHRIL,
      {
        name: "ramda",
        type: "js",
        url: "https://unpkg.com/ramda@0.26.1/dist/ramda.min.js",
      },
      {
        name: "mithril-stream",
        type: "js",
        url: "https://unpkg.com/mithril-stream@2.0.0/stream.js",
      },
    ],
  },
}

export const ShapeShifter = {
  id: "DynamicSVGManipulation",
  title: "Dynamic SVG Manipulation",
  url: SHAPE_URL,
  code: {
    files: [
      { name: "app.js", content: SHAPE },
      { name: "style.css", content: SHAPE_CSS },
      { name: "index.html", content: SHAPE_HTML },
    ],
    links: [MITHRIL],
  },
}

});

;require.register("components/walkabout.js", function(exports, require, module) {
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

});

;require.register("http.js", function(exports, require, module) {

});

;require.register("index.js", function(exports, require, module) {
import routes from "./routes.js"
import model from "./model.js"

const root = document.body
let winW = window.innerWidth

if (module.hot) {
  module.hot.accept()
}

if ('production' == "development") {
  console.log("Looks like we are in development mode!")
} else {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
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

const checkWidth = (winW) => {
  const w = window.innerWidth
  if (winW !== w) {
    winW = w
    var lastProfile = model.settings.profile
    model.settings.width = w
    model.settings.profile = getProfile(w)
    if (lastProfile != model.settings.profile) m.redraw()
  }
  return requestAnimationFrame(checkWidth)
}

model.settings.profile = getProfile(winW)

checkWidth(winW)

m.route(root, "/home", routes(model))

});

;require.register("init-mithril-inspector.js", function(exports, require, module) {
export const sendMessage = (name, data) =>
  window.postMessage(
    {
      source: "mithril-inspect-agent",
      name: name,
      msg: data || {},
    },
    "*"
  )

//mithril-inspector-setup
const addMithrilInspector = () => {
  window.addEventListener("mithril-inspect-agent", (event) => {
    // Only accept messages from same frame
    if (event.source !== window) {
      return
    }

    var message = event.data
    // Only accept messages of correct format (our messages)
    if (
      typeof message !== "object" ||
      message === null ||
      message.source !== "mithril-inspect-devtools"
    ) {
      return
    }

    console.log("need to handle this somehow", message)
  })
}

export const toDto = (mdl) => JSON.stringify(mdl)
export const saveJsonMdl = (mdl) =>
  localStorage.setItem("mithril-inspector", mdl)
export const getLocalMdl = () => localStorage.getItem("mithril-inspector")

export const initMithrilInspector = (mdl) => {
  console.log("init mithril inspector")
  addMithrilInspector()
  let dto = toDto(mdl)
  saveJsonMdl(dto)
}

});

;require.register("initialize.js", function(exports, require, module) {
document.addEventListener("DOMContentLoaded", () => {
  require("./index.js")
})

});

;require.register("model.js", function(exports, require, module) {
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

});

;require.register("pages/about.js", function(exports, require, module) {
export default {
  view: () =>
    m(
      "section",

      [
        m(
          "code.intro-text",
          "After serving as a paratrooper in the IDF I spent the next decade in Academia studying the effects of changes in environment on Human Performance, from pregancy to sports-injuries to space-flight."
        ),
        m("br"),
        m("code.intro-text", [
          "My background in programming started at a 3 month boot-camp at the Iron Yard in Houston (since closed) supplemented with various online courses ",
          m(
            "a.intro-text",
            {
              href:
                "https://online-learning.harvard.edu/course/cs50-introduction-computer-science",
              target: "_blank",
            },
            "from the Harvard CS50 course"
          ),
          " to ",
          m(
            "a.intro-text",
            {
              href: "https://www.youtube.com/watch?v=I8LbkfSSR58",
              target: "_blank",
            },
            "Bartosz Milewski's Category Theory,"
          ),
          " as well as working through An Introduction to Functional Programming Through Lambda Calculus,",
          m(
            "a.intro-text",
            {
              href:
                "https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript",
              target: "_blank",
            },
            " and Brian Lonsdorf's Professor Frisbies Egghead Course on FP in JS,"
          ),
          m(
            "a.intro-text",
            {
              href: "https://github.com/boazblake?tab=repositories",
              target: "_blank",
            },
            " and lots of time spent on personal projects,"
          ),
          "and on-the-job training (Agile, SCRUM). ",
        ]),
        m("br"),
        m(
          "code.intro-text",
          "My current personal interests lie in the nexus of true object oriented programming - as per Alan Kay, and functional programming in JavaScript. I am also a fan of Douglas Crockford and Kyle Simpson’s philosophy of JavaScripts behavior delegation / Objects linked to other Objects and I favour composition over hierarchy."
        ),
      ]
    ),
}

});

;require.register("pages/home.js", function(exports, require, module) {
import { AnimateChildren, fadeInUp, Animate, popIn } from "styles"
import { log, randomPause, Pause } from "utils"
// import { Walkabout } from "components"

const links = [
  {
    href: "https://github.com/boazblake",
    src: "images/github.svg",
    target: "_blank",
  },
  {
    href: "https://www.linkedin.com/in/boazblake/",
    src: "images/linkedin.svg",
    target: "_blank",
  },
  { href: "/resume", src: "images/cv.webp" },
  { href: "/portfolio", src: "images/applications.svg" },
]

const Link = () => {
  let state = {
    hover: false,
  }
  return {
    view: ({ attrs: { href, src, target } }) =>
      m(
        target ? "a" : m.route.Link,
        {
          onmouseenter: () => (state.hover = true),
          onmouseleave: () => (state.hover = false),
          oncreate: Animate(popIn, randomPause),
          target: target ? "_blank" : "",
          href,
        },
        m("img", {
          style: {
            margin: "2px",
            height: "50px",
            width: "50px",
            transition: "transform .1s ease-in",
            ...(state.hover && { transform: "skewY(10deg)" }),
          },
          src,
        })
      ),
  }
}

const calcSize = ({ settings: { profile } }) => {
  switch (profile) {
    case "phone":
      return { width: "200px", height: "200px" }
    case "tablet":
      return { width: "250px", height: "250px" }
    case "desktop":
      return { width: "300px", height: "300px" }
  }
}

export const Home = {
  view: ({ attrs: { mdl } }) =>
    m(
      ".page.frow.row-around",
      {
        style: { maxHeight: "80vh" },
        oncreate: AnimateChildren(fadeInUp, Pause(0.05)),
      },
      [
        m(
          ".frow.row-around",
          { style: { width: "100%" } },
          m(
            ".frow colummn-start",
            m("img#me", {
              style: {
                ...calcSize(mdl),
                transition: " all 1s ease-out;",
              },
              src: "images/me.webp",
            })
          ),
          m(
            ".frow.column-end",
            links.map(({ href, src, target }) => m(Link, { href, src, target }))
          )
        ),
        m(
          "p.frow-container",
          {
            style: {
              color: "black",
              padding: "4px",
              margin: "4px",
              fontSize: "1.4rem",
            },
          },
          "Front-End developer with half a decade of industry experience building a variety of different applications using a multitude of different frameworks and languages."
        ),
        m(
          "a",
          {
            href: "mailto:boazblake@protonMail.com",
            style: {
              color: "black",
              padding: "4px",
              margin: "4px",
              fontSize: "1rem",
            },
          },
          "BoazBlake @ protonMail dot com"
        ),
      ]
    ),
}

});

;require.register("pages/index.js", function(exports, require, module) {
export * from "./home"
export * from "./portfolio"
export * from "./snippets"
export * from "./resume"
export * from "./about"

});

;require.register("pages/portfolio.js", function(exports, require, module) {
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

});

;require.register("pages/resume.js", function(exports, require, module) {
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
              const scale = 1.1
              const viewport = page.getViewport({ scale })
              const outputScale = window.devicePixelRatio || 1
              const ctx = dom.getContext("2d")
              console.log(viewport)
              dom.width = Math.floor(viewport.width * outputScale)
              dom.height = Math.floor(viewport.height * outputScale)
              dom.style.width = "100%"
              dom.style.height = "100%"
              dom.style.overflow = "auto"
              console.log(dom.width)
              const transform =
                outputScale !== 1
                  ? [outputScale, 0, 0, outputScale, 0, 1]
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

});

;require.register("pages/snippets.js", function(exports, require, module) {
import { TicTacToe, GameOfLife, ShapeShifter } from "components"
import { jsonCopy } from "utils"

let snippets = [TicTacToe, , GameOfLife, ShapeShifter]

const Snippet = {
  view: ({ attrs: { snip, Flems } }) => {
    return m(".snippet", [
      m("a.snippet-title", { href: snip.url, target: "__blank" }, snip.title),
      m(".snippet-code", {
        id: snip.id,
        style: { height: "500px" },
        oncreate: ({ dom }) => Flems(dom, jsonCopy(snip.code)),
      }),
    ])
  },
}

export const Snippets = ({ attrs: { mdl } }) => {
  return {
    view: () =>
      m(
        ".snippets",
        snippets.map((snip) => m(Snippet, { snip, Flems: window.Flems }))
      ),
  }
}

});

;require.register("routes.js", function(exports, require, module) {
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

});

;require.register("styles/animations.js", function(exports, require, module) {
export const popIn = [
  {
    transform: "scale(0)",
    opacity: 1,
  },
  {
    transform: "scale(1)",
    opacity: 1,
  },
  {
    transform: "scale(0.8)",
    opacity: 1,
  },
  {
    transform: "scale(1)",
    opacity: 1,
  },
]

export const fadeIn = [
  {
    opacity: 0,
  },
  {
    opacity: 1,
  },
]

export const fadeInUp = [
  {
    opacity: 0,
    transform: "translate3d(0, 40%, 0)",
  },
  {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
  },
]

export const slideInRight = [
  {
    transform: "translate3d(-50%, 0, 0)",
  },
  {
    transform: "translate3d(0, 0, 0)",
    visibility: "visible",
  },
]

export const slideInLeft = [
  {
    transform: "translate3d(80%, 0, 0)",
    visibility: "visible",
  },
  {
    transform: "translate3d(0, 0, 0)",
  },
]

export const slideOutRight = [
  {
    transform: "translate3d(0, 0, 0)",
  },
  {
    visibility: "hidden",
    transform: "translate3d(100%, 0, 0)",
  },
]

export const slideInDown = [
  {
    transform: "translate3d(0, -50%, 0)",
  },
  {
    transform: "translate3d(0, 0, 0)",
    visibility: "visible",
  },
]

export const sideBarIn = () => {
  let animation = Object.assign(slideInLeft)
  animation[1].background = "black"
  return animation
}

export const sideBarChildren = () => {
  let animation = Object.assign(slideInRight)
  animation[1].color = "white"
  return animation
}

});

;require.register("styles/index.js", function(exports, require, module) {
import { jsonCopy, NoOp } from "utils"
export * from "./animations.js"

const duration = {
  duration: 700,
  easing: "ease-in-out",
  fill: "forwards",
}

function transitionEndPromise(element) {
  const transitionEnded = (e) => {
    // console.log("transitionEnded", element, e)
    if (e.target !== element) return
    element.removeEventListener("transitionend", transitionEnded)
  }
  return new Promise(() =>
    element.addEventListener("transitionend", transitionEnded)
  )
}

export const AnimatePage = (animation) => ({ dom }) => {
  // let origStyles = jsonCopy(dom.style)
  // dom.style.position = "absolute"
  // dom.style.top = -19
  // dom.style.width = "100%"
  Animate(animation)({ dom })
  // Animate(animation)({ dom })
}

export const Animate = (animation, pause = NoOp) => ({ dom }) =>
  setTimeout(
    () =>
      dom.animate(animation, duration).finished.then(transitionEndPromise(dom)),
    pause()
  )

export const AnimateChildren = (animation, pause) => ({ dom }) => {
  let children = [...dom.children]

  children.map((child, idx) => {
    child.style.opacity = 0
    setTimeout(() => {
      child.style.opacity = 1
      Animate(animation)({ dom: child })
    }, pause())
  })
}

});

;require.register("utils.js", function(exports, require, module) {
export const log = (m) => (v) => {
  console.log(m, v)
  return v
}

const secureImg = (url) =>
  url.match(/(https)./) ? url : url.replace("http:", "https:")

export const randomPause = () => Math.random() * 1000
export const Pause = (n) => () => n * 1000
export const NoOp = () => {}
export const nameFromRoute = (route) => route.split("/")[1].toUpperCase()

export const jsonCopy = (data) => JSON.parse(JSON.stringify(data))

export const isSideBarActive = (mdl) =>
  mdl.settings.profile !== "desktop" && mdl.status.sidebar

export const range = (size) => [...Array(size).keys()]

});

;require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.m = require("mithril");


});})();require('___globals___');

require('initialize');