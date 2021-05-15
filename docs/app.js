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
require.register("components/hamburger.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hamburger = void 0;

var _utils = require("utils");

var Hamburger = {
  view: function view(_ref) {
    var mdl = _ref.attrs.mdl;
    return m("div.nav-icon", {
      class: (0, _utils.isSideBarActive)(mdl) ? "is-active" : "",
      onclick: function onclick(e) {
        mdl.status.sidebar = !mdl.status.sidebar;
      }
    }, m("div"));
  }
};
exports.Hamburger = Hamburger;

});

require.register("components/header.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Header = void 0;

var _styles = require("styles");

var _components = require("components");

var _utils = require("utils");

var Header = {
  view: function view(_ref) {
    var mdl = _ref.attrs.mdl;
    return m("#header.frow.row-center.justify-between", {
      style: {
        transitionDuration: 2000,
        backgroundColor: (0, _utils.isSideBarActive)(mdl) ? "black" : "white",
        color: (0, _utils.isSideBarActive)(mdl) ? "white" : "black"
      }
    }, [m("code", m("p.typewriter type-writer", {
      id: "logo-header",
      oncreate: function oncreate(_ref2) {
        var dom = _ref2.dom;
        return dom.onanimationend = function () {
          return setTimeout(function () {
            return dom.classList.remove("type-writer");
          });
        };
      }
    }, "{Boaz Blake}")), mdl.settings.profile === "desktop" ? m(".navbar.frow", {
      oncreate: (0, _styles.AnimateChildren)(_styles.slideInDown, _utils.randomPause)
    }, mdl.routes.filter(function (r) {
      return r !== m.route.get();
    }).map(function (route) {
      return m(m.route.Link, {
        class: "navbar-item",
        href: route,
        selector: "li"
      }, (0, _utils.nameFromRoute)(route));
    })) : m(_components.Hamburger, {
      mdl: mdl
    })]);
  }
};
exports.Header = Header;

});

require.register("components/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hamburger = require("./hamburger.js");

Object.keys(_hamburger).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _hamburger[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _hamburger[key];
    }
  });
});

var _header = require("./header.js");

Object.keys(_header).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _header[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _header[key];
    }
  });
});

var _sidebar = require("./sidebar.js");

Object.keys(_sidebar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _sidebar[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _sidebar[key];
    }
  });
});

var _layout = require("./layout.js");

Object.keys(_layout).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _layout[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _layout[key];
    }
  });
});

var _walkabout = require("./walkabout.js");

Object.keys(_walkabout).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _walkabout[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _walkabout[key];
    }
  });
});

var _index = require("./snippets/index.js");

Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _index[key];
    }
  });
});

});

require.register("components/layout.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = void 0;

var _styles = require("styles");

var _components = require("components");

var Layout = function Layout() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl,
          children = _ref.children;
      return m(".app", [m(_components.Header, {
        mdl: mdl
      }), m(".page", children), mdl.status.sidebar && mdl.settings.profile !== "desktop" && m(_components.SideBar, {
        oncreate: (0, _styles.Animate)((0, _styles.sideBarIn)()),
        onbeforeremove: (0, _styles.Animate)(_styles.slideOutRight),
        mdl: mdl
      })]);
    }
  };
};

exports.Layout = Layout;

});

require.register("components/loader.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var loader = m(".holder", [m(".preloader", [m("div"), m("div"), m("div"), m("div"), m("div"), m("div"), m("div")])]);
var _default = loader;
exports.default = _default;

});

require.register("components/sidebar.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SideBar = void 0;

var _styles = require("styles");

var _utils = require("utils");

var SideBar = function SideBar() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("ul.sidebar", {
        oncreate: (0, _styles.AnimateChildren)((0, _styles.sideBarChildren)(), _utils.randomPause),
        onbeforeremove: (0, _styles.AnimateChildren)(_styles.slideOutLeft)
      }, mdl.routes.filter(function (r) {
        return r !== m.route.get();
      }).map(function (route) {
        return m(m.route.Link, {
          class: "sidebar-item",
          href: route,
          selector: "li"
        }, (0, _utils.nameFromRoute)(route));
      }));
    }
  };
};

exports.SideBar = SideBar;

});

require.register("components/snippets/GOL/GOL.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = 'const Stream  = m.stream\nconst compose = R.compose\nconst range = R.range\nconst without = R.without\nconst values = R.values\nconst root = document.getElementById(\'GameOfLife\')\nconst siblingCoords = [[-1, 0],[-1, 1],[0, 1],[1, 1],[1, 0],[1, -1],[0, -1],[-1, -1]]\n\nconst model = {\n  isRunning: Stream(false),\n  board: {},\n  delay: Stream(1000),\n  randomized: Stream(15),\n  size: Stream(30),\n  width: Stream(800),\n  lifecycle: Stream(0)\n}\n\nconst restart = (mdl) => {\n  mdl.isRunning(false)\n  mdl.delay(1000)\n  mdl.randomized(15)\n  mdl.size(30)\n  mdl.width(800)\n  mdl.lifecycle(0)\n  return mdl\n}\n\n\nconst withinBounds = (limit) => (coords) =>\n  !(coords.includes(limit) || coords.includes(-1))\n\nconst toSiblingModel = (acc, sibling) => {\n  acc[sibling] = false\n  return acc\n}\n\nconst calcSiblings = (limit) => (sibCoords) => (coords) =>\n  sibCoords\n    .map((sib) => [sib[0] + coords[0], sib[1] + coords[1]])\n    .filter(withinBounds(limit))\n    .reduce(toSiblingModel, {})\n\nconst makeCell = (mdl) => (size) => (idx) => {\n  let coords = [idx % size, Math.floor(idx / size)]\n  let siblings = calcSiblings(size)(siblingCoords)(coords)\n  let cell = {\n    key: idx,\n    value: "",\n    isAlive: false,\n    coords,\n    siblings\n  }\n  mdl.board[coords] = cell\n\n  return mdl\n}\n\nconst makeBoardFromSize = (mdl, size) => {\n  mdl.size(size)\n  return range(0, size * size).map(makeCell(mdl)(size))\n}\n\nconst calculateCell = (mdl) => {\n  Object.keys(mdl.board).map((cell) => {\n    let cellsAlive = without([false], values(mdl.board[cell].siblings)).length\n\n    if (mdl.board[cell].isAlive) {\n      if (cellsAlive <= 2) {\n        mdl.board[cell].isAlive = false\n      }\n\n      if ([2, 3].includes(cellsAlive)) {\n        mdl.board[cell].isAlive = true\n      }\n\n      if (cellsAlive > 3) {\n        mdl.board[cell].isAlive = false\n      }\n    } else {\n      if (cellsAlive == 3) {\n        mdl.board[cell].isAlive = true\n      }\n    }\n  })\n  return mdl\n}\n\nconst updateSiblings = (mdl) => {\n  Object.keys(mdl.board).map((cell) =>\n    Object.keys(mdl.board[cell].siblings).map(\n      (sibling) =>\n        (mdl.board[cell].siblings[sibling] = mdl.board[sibling].isAlive)\n    )\n  )\n\n  return mdl\n}\n\nconst runGOL = (mdl) => {\n  if (mdl.isRunning()) {\n    mdl.lifecycle(mdl.lifecycle() + 1)\n    setTimeout(() => {\n      m.redraw()\n      return runGOL(updateCells(mdl))\n    }, mdl.delay())\n  } else {\n    return mdl\n  }\n}\n\nconst randomizeCells = (mdl) => {\n  let randomCells = Object.keys(mdl.board)\n    .sort(() => 0.5 - Math.random())\n    .slice(0, Math.floor((mdl.randomized() / 100) * (mdl.size() * mdl.size())))\n\n  randomCells.map((cell) => (mdl.board[cell].isAlive = true))\n\n  return mdl\n}\n\n\nconst initBoard = mdl =>   {  \n  makeBoardFromSize(mdl, Number(mdl.size()))\n  createSeed(mdl)\n}\n\nconst makeNewGame = mdl => e => {\n  restart(mdl)\n  initBoard(mdl)\n}\n\nconst advanceLifeCycle = mdl => (e) => {\n  mdl.isRunning(false)\n  mdl.lifecycle(mdl.lifecycle() + 1)\n  updateCells(mdl)\n}\n\nconst goForth = mdl => (e) => {\n  mdl.isRunning(true)\n  runGOL(mdl)\n}\n\nconst randomize = mdl => (e) =>{\n  mdl.randomized(e.target.value)\n  initBoard(mdl)\n}\n\nconst setDelay = mdl => (e) => mdl.delay(e.target.value)\n\nconst setBoardSize = mdl => (e) => {\n  mdl.size(e.target.value)\n  initBoard(mdl)\n}\n\nconst updateCells = compose(calculateCell, updateSiblings)\nconst createSeed = compose(updateSiblings, randomizeCells)\n\nconst Cell = {\n  view: ({ attrs: { mdl, cell } }) => {\n    return m(".cell", {\n      class: cell.isAlive ? "alive" : "dead",\n      style: {\n        fontSize: `${mdl.width() / mdl.size() / 2}px`,\n        height: `${mdl.width() / mdl.size() / 2}px`,\n        flex: `1 1 ${mdl.width() / mdl.size()}px`\n      },\n      onclick: () => {\n        mdl.board[cell.coords].isAlive = !cell.isAlive\n        updateSiblings(mdl)\n      }\n    })\n  }\n}\n\nconst Board = ({ attrs: { mdl } }) => {\n  initBoard(mdl)\n  return {\n    view: ({ attrs: { mdl } }) => {\n      return m(\n        ".board",\n        { style: { width: `${mdl.width()}px` } },\n        Object.keys(mdl.board).map((coord) => {\n          let cell = mdl.board[coord]\n          return m(Cell, { key: cell.key, cell, mdl })\n        })\n      )\n    }\n  }\n}\n\nconst Input = () => {\n  return {\n    view: ({ attrs: { mdl, label, min, max, step, value, fn } }) => [\n      m("label", [label,\n      m("input[type=\'number\']", {\n        inputmode: \'numeric\',\n        pattern:"[0-9]*",\n        min,\n        max,\n        step,\n        value,\n        onchange: e => fn(e)\n      })\n      ])\n    ]\n  }\n}\n\nconst Button = () => {\n  return {\n    view:({attrs:{mdl, label, fn}}) => m(\n        "button", {onclick: (e) => fn(e)},\n        label\n      )\n  }\n}\n\nconst TopRow = {\n  view:({attrs:{mdl}})=>\n   m(\'.topRow\', [m(Button, {mdl, fn: makeNewGame(mdl), label: \'New Game\'}),\n      m(Button, {mdl, fn: advanceLifeCycle(mdl), label:"Advance 1 Lifecycle"}),\n      m(Button, {mdl, fn:goForth(mdl), label:"Go Forth"})])\n}\n\nconst BottomRow = {\n  view:({attrs:{mdl}})=>\n    m(\'.bottomRow\',[\n      m(Input, { mdl, label: \'Randomize(%):\', min:0, max:100, step:1, value:mdl.randomized(), fn:randomize(mdl) }),\n      m(Input, { mdl, label: \'Delay(ms):\', min:0, max:1000, step:100, value:mdl.delay(), fn:setDelay(mdl) }),\n      m(Input, { mdl, label: \'size:\', min:30, max:100, step:10, value:mdl.size(), fn: setBoardSize(mdl) })])\n}\n\n      \nconst Toolbar = {\n  view: ({ attrs: { mdl } }) =>\n    m(".toolbar", [\n      m(TopRow, {mdl}),\n      m(BottomRow, {mdl})\n    ])\n}\n\nconst GameOfLife = {\n  view: ({ attrs: { mdl } }) => {\n    return m(".container", [\n      m(Toolbar, { mdl }),\n      m(Board, {\n        mdl\n      }),\n      m("h2", `lifecycle: ${mdl.lifecycle()}`)\n    ])\n  }\n}\n\nm.mount(root, {view:() => m(GameOfLife, {mdl:model})})';
exports.default = _default;

});

require.register("components/snippets/GOL/GOL_CSS.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "* {\n  font-family: Montserrat, Sans-Serif;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  outline: none;\n}\n\n.toolbar {\n  line-height: 70px;\n  padding: 10px;\n  border: 1px solid #ecf0f1;\n  justify-content: space-between;\n}\n\n.topRow {\n  display: flex;\n  flex-flow: wrap;\n  justify-content: space-around;\n}\n\n.bottomRow {\n  display: flex;\n  flex-flow: wrap;\n  justify-content: space-around;\n}\n\nbutton {\n\tbox-shadow: 0px 10px 14px -7px #276873;\n\tbackground:linear-gradient(to bottom, #599bb3 5%, #408c99 100%);\n\tbackground-color:#599bb3;\n\tborder-radius:8px;\n\tdisplay:inline-block;\n\tcursor:pointer;\n\tcolor:#ffffff;\n\tfont-family:Arial;\n\tfont-size:20px;\n\tfont-weight:bold;\n\tpadding:13px 32px;\n\ttext-decoration:none;\n\ttext-shadow:0px 1px 0px #3d768a;\n}\nbutton:hover {\n\tbackground:linear-gradient(to bottom, #408c99 5%, #599bb3 100%);\n\tbackground-color:#408c99;\n}\nbutton:active {\n\tposition:relative;\n\ttop:1px;\n}\n\nlabel > * {\n  padding: 10px;\n  margin: 10px;\n\tbackground: #1abc9c;\n\tcolor: #fff;\n\tfont-size: 1em;\n\tline-height: 30px;\n\ttext-align: center;\n\ttext-shadow: 0 1px 0 rgba(255,255,255,0.2);\n\tborder-radius: 15px;\n}\n\n.board {\n  display: flex;\n  flex-flow: wrap;\n  width: 800px;\n  background: #ecf0f1;\n}\n\n.cell {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid #8e44ad;\n  cursor: pointer;\n}\n\n.alive {\n  background: #8e44ad;\n}\n\n.dead {\n  background: #ecf0f1;\n}";
exports.default = _default;

});

require.register("components/snippets/GOL/GOL_HTML.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = '<div id="GameOfLife"></div>';
exports.default = _default;

});

require.register("components/snippets/GOL/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _GOL = require("./GOL.js");

Object.keys(_GOL).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _GOL[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _GOL[key];
    }
  });
});

var _GOL_CSS = require("./GOL_CSS.js");

Object.keys(_GOL_CSS).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _GOL_CSS[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _GOL_CSS[key];
    }
  });
});

var _GOL_HTML = require("./GOL_HTML.js");

Object.keys(_GOL_HTML).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _GOL_HTML[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _GOL_HTML[key];
    }
  });
});
var _default = "https://flems.io/#0=N4IgtglgJlA2CmIBcAWFA6ATCgNCAzgMYBOA9rLMgNoCsOADALp4BmEC+1oAdgIZiIkIdAAsALmEp5CpbmPhzkIEAF8cPfoOEArTtNnzFQmd3xiABAGUxxeP3PmAvObDozt-gB1uJs+ZlgAA6k+PBO5gBK6AHBod6+FsS83ADmYc5RSanw8bJ+AO4QYiKkAK4WGeiFxWViuaYWAG68sKXw+OFRza3t3vV++BAARrAQqQDCpKTEUB3OVFQAtACMOOZMOEur5svMVPRru5vbR1TbG2drK3sH5tebK1e7jH0+eRZgpFDwsOHA3g4IPgIqVuNwxikkFYbHYwAAKFgtUIAShwAPMQ1IvBmUOAanR31gvAAnlDrB54ct6NTUeislBSJAAF7wKBkmH8OHLGi07gOQYs9kUuEAZnovIchSgxSFsLhAA4aWi+eZRix4IRiYQELLOeLvCpXglzLYzNiKuY4WA4MinAA+cz-FXW2DoIEgsEQhFI+DI9Eu9CEklc6n651wdD0xkQFlQLk8-0RgXwUVhhwBqXFBU0xOutUarUIOFpk3wMSlYh8l0G179CzVERjABCZW4s3CcNGkDEtscDrhMmms17dvRAEIB1MZvg3T5Wt98J2IN3bQAfVf+KezWfa0oLuErZF+7h18xiUiWYajVIAWS+Pw7vEIhDWgxGEJHjvRT8IVDf15SRhwkRWA4hVWxy0rcwfxrE83gafwWkIS931SOZLS7IpPzhN9JiHfBsMHacR3RXCt3wdEHHQMBeECOEcOGT8-2GfYgIAak3fDWNfFjdnMDiiNmM5GEYY8HCothYHkYg4QbZtW1mJcVzE8TI1ZUpCBTc8UIAu9CTWPFj1PGiAGt4HGH5fmcK0bXtS1k2w6AAA9PydBwEAsQT0KoZzzAAUnMZM1hvXhinQFhYCnOFfIAekCmNfReFUPPi1CUnQwgkJ0iFFwchi0rw4jJ3wlSUs0ig-ko8wzNJcxnOVcTzG6NooU8EA2oa8SgQAQVGRp4ChEDQk6hwvJG1KAIolVDXDV1MWxKAqC8oDnHK2BXgcCCKyrOBYOM3gzJbBaADEyDAS8WQ7F0eJZVzczcBKGNuuky22k1kjSYsbrCAAqeLbuo2irQO8zLJs2BkSe31jxm09MtgQhSiJeQLIq6yXTulUAHkhm0DUxHQGrFwDeaZmRQG6IHSzMcasrLPwXqIH68IG1qOEqCG+BmCalo2mJiNScWtbGAetKCPJhBUmKDaupYS0SaxGYlsskWer630vxVRqIDlqmKAZ9XzAAHmcTBbTcxrxIVhblYoVWDaZ9JzE5qqHFhrXZctKhMDWEVVbnPd2j10DGf6o9Nctq2BcVoWVbdB3mecGw2ld8x3cjnXLTWhOwgdEVzdT9No5t4X49Dp2XY9t2qpUcwflCCPLcz4Oc6cZx88byPraV0u1cd8Jk5yKu05r9EVBUraoOrbh3eNUpAigUL4GytCrtsvtG5xvHCAJonwfQQXyZoym1pIj2t-xwn4GJfm5pj23YBF-8cqPoHU-ygCz8jhx98Fh+n6vDlZiaUVouGLkrZ+qR7blxUg4FSRlwKvSnrtGeRp3gmlBAAcSxgAGTXhDOyFtm4BndKCcEqQ4ThwtkXPMOsCzahTAGfMmoGGUP4jsWBgUywABVlzwDZmwje1CrZqSgEkfIlDU6Tz5MQLBuC4Tz0Xijem4Mjw1zWAGIMxJKEqVrvXMIwjpFgPWtNPa8E-BRmZKDfW+CaaqjLO9NsjJUagXCBfHeV8b6-xjpwtw0wxD0U-PQdANA7jmBCmFSxOiqpuFGJpL64TQoiHCpFaY9EAyWISnGW0cUqTinMH9feyY2F-QDMUo8ai4KbWSAyMALiZzH3oqfOy3iS5xz7onM8sjoYyyMdPd2p4xhFCOjMcILo7IOGAA4f0IMRlQFOoyC6jC4BrAAHKlDAEMeAMkymPQqeiEgdh5CWHgKyVRZjjSmXgKs+A+RMGaDGXAOy6QHQW1NGIc05yVRDLEHMr5s90G8CgM0Hw8AcF0PGIWJ24yN5wg1kI+6pDPQUM5ipJhdCWFFnReqTFKZbQcWWCpRRS96n-LQQhFIpBjr+JEI8qy-Z4WvMRcCMhXpB4TzkTgslcFjSZMus4GFDKRwWwyTU6MsY4XoA+cQNIBNmq+nRD8v5GMLnoNCGIAAIj8EkdKWmMuMYGbV2j4BSuxLK9A8qEHGnVXMpZurYX6pFUmR6JrpXmstYq8EvyY7ctPMS5RNjVqMliCmeGiNkbWNgGsf1y9AFoWPMaQ5S8TmsnCDEEIKYY0r3SmsPlkaCLkr8C4yqKpGgQFuVCOEUzQo2HwLiYxaw1ppzTnYzaSCqxwjatESyHVO7iW1LwfAdb-CWTLobAA-OYNqLRHZtXMK1EA3wgUdVTmYYkOo+2NRYAYJZUIAAGAASYAGZoBZhyQa8p5g4qYBUIEJye7xqNREPACAKRxD7qPSe6UIg2FxV2SyX95gb13ofYXZ2CAnL7uWDscwn6IyZh-ee-9eLb33tTviYeshtQQEICZStrbLbd1jhQaI5FoGG2cGONaY7Z3DwcFmuN6UvmRxmo1ceY9VUITmR2atYha31vGbXcehDPXDJ9SqxBkE+TCLLRWy0vH+OOmMc24TCLh59M7XRqdwhBYrq01MtdG6pkIY-ce+Dp7EOob3Spx94l3G72vrfA+PiKZNK3ARyOdM0YGr-oJJK39xIaZcQZaq18oTUZqo2yyGinnsa03FyOnDWMj1QTy9BABJbggRygdjsUYmT5b8iVoU8QYdUzrqql4FsqNLgxgaN4E5V88hAhrHlWsFgfIhNMVTvCNqRJqu9qoP1n4tnesgDGNlsQVAxDEkCPARwABybgGytnEAWy8EABkwMTfKJ8b4UIlsbO2ThhbtmHCBBrds7gSA2r7EWAATkYD9PTAXIDcDOy4BrH2zDwBa2BtrYGsMiA+gNOudkOtws4W7KH5hRJVX8ylgFXHyjnj5NZPL7a+2yaK1WmtpWkBmZq8NmrHWVCqYdL1rTbUhgo9kL24AWG4l4ctPqiHvoMMBeJ6nXRnG-DcNIIECIpB8glocNjpAuO+P48J2T5EfZKLwgW1KgXQv8infMFQeETZafvcdBVjrUIrk3LuZoVRaxicHeN+Ye5AgFvj1G3CbXfHZAGX19d6CwLkiaXBeqSFrCMbm6qz8G7IBuqe9BTBn39CEBtXtz1x3OvXcrOdtdyl1LiBZgD5V6rIfMGkHMOn6WqhkRw9S6eFszuwCq9F01QrEvgB47rTL8e8uPaK+c5X1Xp2qDx8y5NkLFWLfmAWxEMVVi4R+WREgdXb2kC3BopBvJTXftIG2PKpAoqnFWOye167ebVEtod338oA-k9D4W1qok2iwAEWnxosYc-6uL9DMvwIq-qStd5gNTRRrKG76QOqpfsGBjIfr3llifkpoPkHrAAdsmHfrVtdmKE-u-rcD9m-lSJ-j0Bvs6gBqiCnlCDajHEsgfuPKXunJbKePzuQEMNiDXuLvJtBFLmVspl1vaFVGNsrtQdiINvHvzoLsLknrAHHsPFrqQJ3gIXrnAAluJGQYWhYDbvAFjCwFHnQXXgwY3gJrFi2iJh7Bpl2iYB8mMNsjwSIXCFQbADQcQKfr8MIV3I7jHFtlptPCxhKIRp2iACIJgL2nuswlClCHBrQjilCpQioHupwqXtXGXtwK4J8KCAEgyIjAIHIM5lAMSOYAZOLoIhTnCAoUoVHoIRvveEIciOPJtiADEOwNskoDQdVmUaEAgDvBAHkEoDQPKEgJgAAGyLCtFIAigADsqg6gIAfAAgSg0QQ6ZRBhCgYgSgf0Fs26cgiwiIkAsAtUd4cgoQxASQYgawlgyQ+AiwJyxAOsAA3OiIsPkPAEMCZEUIsJiE5IsAKBCFCJiDMNsncaQE5GcSqIsJ8EyB8Q8U8akC8UOO8fcd8Q4PcY8TGM8RiKCcQACRCeYLUNeKDtwLIPAN8e7JwRYbQRbKiYsM+q+u+uYH0fQHekiRdjALCVSBSeiK8d8MQFCMsHeoFOQNAOYAAMQagsD0AsDLBInaClBmA6zEiLBTFyAEEXaaR3FliXEKBYmvDK78Ei4WxQBAiBBX6DQQZIkRTwAPERTC5Qj5BJCBCCnCliCinikGDTFSlPjwCLDYgKSKlwQd7nhV7C6Nzqn4Cakkjan6m6kQZLGRRFbmAmm0TmkiksBikSliB2kylOmghQAuneA07O7SZ9BiBQn4DA4MihnklOQ7AFk7AoCsmLB9GsmcmYB9EdHyh9EijfGeBZlPgmQpBkBJlIConYiLBtlArlpyBwjnhwmV5rCck0D3b3ZDBDAijmA0B+SjkoD0DyiEATlFn0CT6NnNm4ZtkKTWmRRMljkTlTkNmZkMnvFJDqnClIDyh0knhiDem+mkhjAEkjCkC4abmIylbTBIDBBjDSQfnkDfmcksAgWgWbkLFiBLH8DsCkjdTHEtDgUGDQmCiYAFmIWLGXHElxmYiwDJmZlUnqnAnLAiiskiiYC3lNnyBOSQXfAyDbFNHXboncCYmZlUWQU5lApGnFksmFnFmckihQA1nyi8Aulpmo5IAlD9TECaxNk0HbntltidlGHdm9nqnTGDn56YgjlcmLnLmrlzmjnjmTnTlrkbmnktk7lJl7lAW6Urn3aiU65IBPiWnMxOhNmxBFAMVIC2DIyOybnnjoG3nuzE7mAOhzHogEU0loUzIyoP5FkUVbmtkKVshcnLBVYrmEAAX7lQjAUgXoXsUJTMnwBgCbkElElvpxnmBigJVsWOmjApDu6aRyDbL+X6nsW5lGnrA7Csn0AmgpA0FwiYA0B0BDUjXDUMBYDIiblnkIkXkQBXk7A0BBVKmCxekalangYBnoh6kGkhnGmmlIkmbmCKjRUqhyVJUKQ5U8l8kClmLdoVRqnrV+mbVfHfj1XcCLBFDFXDpNX-nohClRkxk2mSkjrNXEBIkzXMmsn4DslQBcnyjwBoBApImfkw1MnmC-lg0pncDoAzquX0kWXJU5UI1I14VRGGpAqNznWWWKVcnXX8lYl1E-D4wMWcBCA0Cr4dGqDMAgDXgmRs1UAaCjFCDdgiDHFSAgAViUBCDiBiCBB1oxQxSgiBCtmkZgAxSi3i0AACmA6AwSKAGtRQYt7A1EYw6AugZRM2c2SgRAxxgQMxagQtWgSQ1ovAZRUtSgst8tSAitytqtAQMULti8WtwSnR6AywMU3pYggd-Ai8ptONFteAVtWgttEA9tgxTtSgmt7AjxHIYA7txA0tHhfG3tvtWW-tjIhtxQ4tudFIOtetetMU7gsI5tegIAydNtJAadDtjAKgQAA";
exports.default = _default;

});

require.register("components/snippets/SHAPE/SHAPE.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SHAPE = void 0;
var SHAPE = "const valueToPoint = (value, index, total) => {\n  var x = 0;\n  var y = -value * 0.8;\n  var angle = ((Math.PI * 2) / total) * index;\n  var cos = Math.cos(angle);\n  var sin = Math.sin(angle);\n  var tx = x * cos - y * sin + 100;\n  var ty = x * sin + y * cos + 100;\n  return {\n    x: tx,\n    y: ty\n  };\n}\n    \nconst statsToPoints = (stats) => {\n  var total = stats.length;\n  return stats.map((stat, i) => {\n      var point = valueToPoint(stat.value, i, total);\n      return point.x + \",\" + point.y;\n    })\n    .join(\" \");\n}\nconst update = stat => e => stat.value  = e.target.value\nconst remove = stat => stats => stats = stats.length > 3\n      ? stats.splice(stats.indexOf(stat), 1)\n      : 'Cant Delete Anymore'\nconst add = stat => e => {\n    e.preventDefault()\n    if(stat == '') return\n   stats.push({label:stat.toUpperCase(), value:100})\n   newlabel = ''\n } \n \nconst stats = [\n    { label: \"A\", value: 100 },\n    { label: \"B\", value: 100 },\n    { label: \"C\", value: 100 },\n    { label: \"D\", value: 100 },\n    { label: \"E\", value: 100 },\n    { label: \"F\", value: 100 }\n  ]\n  \nlet newlabel = ''\n\nconst AxisLabel = { view: ({attrs:{point, stat}}) =>\n  m('text', {x:point.x, y:point.y}, stat.label)}\n\nconst Polygraph = {\n  view: ({attrs:{stats, points}}) => m('g',[\n    m('polygon', {points}),\n    m('circle',{cx:100, cy:100, r:80}),\n    stats.map((stat, idx) => \n      m(AxisLabel, {\n        point:valueToPoint(+stat.value+10, idx, stats.length),\n        stat\n        })\n    )\n  ])\n}\n\nconst Controls = {\n  view:({attrs:{stats}}) => m('', [\n    stats.map(stat => m('.',[\n      m('label', stat.label),\n      m('input',{type:'range', oninput:update(stat), value:stat.value, min:0, max:100}),\n      m('span', stat.value),\n      m('button.remove',{onclick:e=>remove(stat)(stats)}, 'X')\n      ])),\n      m('form#add',[\n        m('input', {\n          oninput:e => newlabel = e.target.value,\n          name:'newlabel',\n          value:newlabel}),\n        m('button',{onclick: add(newlabel)},'Add')])\n      ]        \n  )\n}\n\nm.mount(document.getElementById('ShapeShifter'), {\n  view:() =>\n    m('.#demo', [\n      m('svg',{width:200, height:200}, m(Polygraph,{stats, points:statsToPoints(stats)})),\n      m(Controls, {stats}),\n      m('pre.#raw', JSON.stringify(stats, null, 4))\n    ])})";
exports.SHAPE = SHAPE;

});

require.register("components/snippets/SHAPE/SHAPE_CSS.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SHAPE_CSS = void 0;
var SHAPE_CSS = "body {\n  font-family: Helvetica Neue, Arial, sans-serif;\n}\n\npolygon {\n  fill: #42b983;\n  opacity: 0.75;\n}\n\ncircle {\n  fill: transparent;\n  stroke: #999;\n}\n\ntext {\n  font-family: Helvetica Neue, Arial, sans-serif;\n  font-size: 10px;\n  fill: #666;\n}\n\nlabel {\n  display: inline-block;\n  margin-left: 10px;\n  width: 20px;\n}\n\n#raw {\n  position: absolute;\n  top: 0;\n  left: 300px;\n}\n";
exports.SHAPE_CSS = SHAPE_CSS;

});

require.register("components/snippets/SHAPE/SHAPE_HTML.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SHAPE_HTML = void 0;
var SHAPE_HTML = '<div id="ShapeShifter"></div>';
exports.SHAPE_HTML = SHAPE_HTML;

});

require.register("components/snippets/SHAPE/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SHAPE_URL: true
};
exports.SHAPE_URL = void 0;

var _SHAPE = require("./SHAPE.js");

Object.keys(_SHAPE).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _SHAPE[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SHAPE[key];
    }
  });
});

var _SHAPE_CSS = require("./SHAPE_CSS.js");

Object.keys(_SHAPE_CSS).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _SHAPE_CSS[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SHAPE_CSS[key];
    }
  });
});

var _SHAPE_HTML = require("./SHAPE_HTML.js");

Object.keys(_SHAPE_HTML).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _SHAPE_HTML[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SHAPE_HTML[key];
    }
  });
});
var SHAPE_URL = "https://flems.io/#0=N4IgtglgJlA2CmIBcA2A7AOhQFgDQgGcBjAJwHtZZkBtABl1oF18AzCBAm0AOwEMxESEBgAWAFzBV8RMtzHw5yECAC+uHv0HCAVp2mz5ioTO4ExAAgBuvWAFd4AFTIAFMhDnmAvOYAU1u-C45u5Q8AAeQWJkYjYAlF4AfObAADrc5la8JOZhXua0ANxpGdbZAJ55ALT+9uYAVPkYABxF6ZnZvNwA5gh5Pj4AsrxiIhjOAJL15gBM8QD05lExsPENIeGtJVnmMgR5QyMYuz6dPfCxm+3mBO77w6M33CfdCBfFV2K53rkNu+aV5gqDUe5gA1OYAIy0QrvUqLCrfKYg8FAnZkPbgqEwtokeBiWwkdKpNoZMJIRYRd4ZMrksRld4qVoqKnmNImMzXGJiAhOVzubl9MzDAjxTxJYlbbJLGx5IXcjAIbojS64-GEznCjBgXgAB36cqCEFF4pZkvMOrcHm8NUcLktYh8cowNsNkWicUuGQyqoJ6Qt-IwuXBKRAuBDYPN9owZU95hUsRZGG0lp84ZDb24zO47Isth1UGG8FlXMS5iLYo1YmdNlqeXgGBiJC6eOrATZsg5uLAZEs5crpblewrg+LmsVXRG5iSAGZTeYAPyVggYAg62AQIjwR1c5frMIAeRY2+GsSCEITJK95IA5ABhToWAAi8AQ8nMAEFuGVu7jr+3TBYvAwKOFgVuWJqXvWOq4r2cjPiwvC2LADoXl6wRHnKXjeNe17xD6hJUoOGA6rYBAiD4wCwLwABGL5IE6UQAKo6jq8AkPeBBbqemQBEgWLxlS3DwAA7lRtGwHkOHFCorLpP+HIjt41AssA5hiXRrIgO+IZBDa5JYnGYaXqp6mwOSIYAEI6Tx9j6dChkqWpNEaSGt7WXpkL2WojmmeZICPu5NbwHZtAOcZTniX5ACigW8Z5oXeeFvmaQAYrFtnxXG7yMO8aSvuYQmic5EnYX+3DyRY75hBABAADLFXkqmWBAInkhRwxiCQBBIMA-pyEEcoqPGiTvGAPjXvIYRiNeQTAGSfVVhEgJIAt0ZqJWCrFbEWYVeYriwGUXQkLqIiNbCLXCW1wAdV1PWDkEC0EENxrmGN15dDNymXm9FoHV0sgzckj3xkZaFvUQEAkEQCAzcARBkliQREDSiPmCQSBNLQIMskR2p6seYiGlAYQvXOY1VTV9XibNc4ZAtSA2ry9o+KCTo2qCUJE0tRHjiMp605WAsCZeqHmIwF47dmHYWLeBjkLAQ7JOdrXtWInXdcAg7PaWb2A19aG47qBM6+NGCfWT42mYDTqmfzl4ZG97gkdN6h0qxSDXsd3TwIDshO7YYhIHmBbyAT3F6WzQVBJA3BIPQr28Aj0LY-br3jaunTW1yrb2HbaEO+N1EB1E3AYF2PY++osjQxuADWSDwGK5e9mHBMiut14ABq4XO4t5-nb0sGQJBgAAxEBUDm6nBfXv7LtK9PXp+9wzsN6WhWmXWDZZM2VYugLGR8AIHsb8VM0HzZwWn+JKf516b1F2rANV9m65EPX5gTz418vttuDXu+GAuFxa9zvhkd4Es0hpDAFqMgtg5A+CgGQIgtgBByAwNRMgUAyg0zaM1FWxoWRvQwKPUI3Y9YW2vAQSwH11DCWgCMJA0xoRBBEPACAXRxBMOTtHHw+1DrHR1CIdQ91Iz8m6oOJm4i27bViP3MGPhZZyHlgQWaWt5H33GtBeso9jrCUBgAKQAMr7gAHIrk6u4LoEAWBlDbkEbgSFYBBGwHIlk4t4yhhADIMAOp2BsSUNRYqXjOIICIGICAHYlAQgAKx8VUOoEAR8tBHAIHobxBgFBiECVgioEpzBDzkJUBCkADrkgABIvl7BEogvBzCmPgPYII74SAQBsANToBBKicVaSwJkUCV4UEOrIBeGQ2CUHJKPbA0xqIAE4mjTkuGQHUvAIZ0nJLQDAaAYn9PKtmSG0Miz5PGWZRYXsM64jkJcMw5Ba7BXMKPWZTzdlpEmhYY5Bhin8HYDScwlTYDVI3HUhpTSPytPadcTp3S2I2MuIUsQ3SIAAC97lQh1GEOF7BTmjxQLil53BN75KgDVNcvBfnuHXEJSo1FYDINrpcbUTZ3CVAQCwQOnl0WXHoVARhMxaCcrSJLXRvBhKjMjDcCJshyQ0QIBQAO8BLhRB1Bsy4rL2XTmhAKzMaQQkvngOEyJpglC0DjpUacEI46qGYCASltdOBIGoBoAQShIAjFaVIEABIqBCHEGIHU3U5hzHgTqWuXQjhkDAHMV1Ih3UAAFpgYE2dgKNEA3XsC1O4JM6S3ZaGIK0nU2SVCMBUEAA";
exports.SHAPE_URL = SHAPE_URL;

});

require.register("components/snippets/TTT/TTT.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TTT = void 0;
var TTT = 'const getRandomInt = (min, max) =>\n  Math.floor(Math.random() * (1 + max - min) + min)\n\nconst players = {\n  true: { score: 0, mark: "X" },\n  false: { score: 0, mark: "O" },\n}\nconst boardSizes = R.filter((n) => n % 3 == 0, R.range(0, 60))\n\nconst getDiagAcross = (acc, set, idx) => {\n  let r = acc.concat(set[idx])\n  return r\n}\n\nconst getDiagDown = (acc, set, idx) => {\n  let r = acc.concat(set[set.length - (idx + 1)])\n  return r\n}\n\nconst winningSetBy = (mdl) => {\n  if (mdl.size) {\n    let spaces = R.range(1, mdl.size * mdl.size + 1)\n    let setsAcross = R.splitEvery(mdl.size, spaces)\n    let setsDown = R.transpose(setsAcross)\n    let setsDiagAcross = setsAcross.reduce(getDiagAcross, [])\n    let setsDiagDown = setsDown.reduce(getDiagDown, [])\n    let winnings = setsAcross\n      .concat(setsDown)\n      .concat([setsDiagAcross].concat([setsDiagDown]))\n    return winnings\n  } else {\n    restart(mdl)\n  }\n}\n\nconst mdl = {\n  winnerSets: [],\n  winner: null,\n  turn: true,\n  players,\n  board: null,\n  size: 0,\n  width: 800,\n}\n\nconst markSelectedSpace = (mdl, key, mark) => {\n  const space = R.filter(R.propEq("key", key), mdl.board)\n  let updatedSpace = R.set(R.lensProp("value"), mark, R.head(space), mdl.board)\n  let index = R.findIndex(R.propEq("key", key))(mdl.board)\n  mdl.board = R.insert(index, updatedSpace, R.without(space, mdl.board))\n  return mdl\n}\n\nconst markRandomSpace = (mdl) => {\n  let emptySpaces = mdl.board.filter(R.propEq("value", ""))\n  let AISpace = emptySpaces[getRandomInt(0, emptySpaces.length - 1)]\n  !mdl.winner && AISpace && markSpace(mdl)(AISpace)\n  return mdl\n}\n\nconst updateTurn = (mdl) => {\n  mdl.turn = !mdl.turn\n  return mdl\n}\n\nconst isWinningSpace = (mdl, key) => {\n  let value = R.prop("value", R.head(R.filter(R.propEq("key", key), mdl.board)))\n  let sets = R.groupBy((c) => c[1])(mdl.board.map(R.props(["key", "value"])))\n  let keys = R.keys(R.fromPairs(sets[value])).map(Number)\n  let isWinner = mdl.winnerSets\n    .map((set) => set.every((key) => keys.includes(key)))\n    .includes(true)\n  return isWinner\n}\n\nconst checkIfDraw = (mdl) => {\n  if (!R.pluck("value", mdl.board).includes("")) {\n    mdl.winner = "No One"\n    return mdl\n  }\n  return mdl\n}\n\nconst markSpace = (mdl) => (space) => {\n  let player = mdl.players[mdl.turn].mark\n  if (isWinningSpace(markSelectedSpace(mdl, space.key, player), space.key)) {\n    mdl.players[mdl.turn].score++\n    mdl.winner = player\n    return mdl\n  }\n  checkIfDraw(mdl)\n  return mdl\n}\n\nconst nextTurn = (mdl, space) => {\n  return R.compose(\n    updateTurn,\n    markRandomSpace,\n    updateTurn,\n    markSpace(mdl)\n  )(space)\n  return mdl\n}\n\nconst restart = (mdl) => {\n  mdl.winner = null\n  mdl.size = 0\n  mdl.board = null\n  mdl.width = 800\n}\n\nconst makeBoardWithSize = (mdl, size) => {\n  mdl.size = size\n  mdl.board = R.range(0, size * size).map((n) => ({ key: n + 1, value: "" }))\n  mdl.winnerSets = winningSetBy(mdl)\n}\n\nconst Space = {\n  view: ({ attrs: { mdl, key, space } }) =>\n    m(\n      ".space",\n      {\n        style: {\n          fontSize: `${mdl.width / mdl.size / 2}px`,\n          height: `${mdl.width / mdl.size / 2}px`,\n          flex: `1 1 ${mdl.width / mdl.size}px`,\n        },\n        onclick: (e) => !mdl.winner && !space.value && nextTurn(mdl, space),\n      },\n      space.value && m(".value", space.value)\n    ),\n}\n\nconst PlayerScore = {\n  view: ({ attrs: { player, mdl } }) =>\n    m(".score-card", [player.mark, ":", player.score]),\n}\n\nconst Toolbar = {\n  view: ({ attrs: { mdl } }) =>\n    m(".toolbar", [\n      m("button.btn", { onclick: (e) => restart(mdl) }, "New Game"),\n      Object.keys(mdl.players).map((player, idx) =>\n        m(PlayerScore, { key: idx, player: players[player], mdl })\n      ),\n    ]),\n}\n\nconst Game = {\n  view: () =>\n    mdl.board\n      ? m(\n          ".game",\n          { style: { width: `${mdl.width}px` } },\n          mdl.board.map((space) => m(Space, { key: space.key, space, mdl }))\n        )\n      : [\n          m("h1", "select a board size"),\n          m(\n            "select",\n            {\n              value: mdl.size,\n              onchange: (e) => makeBoardWithSize(mdl, Number(e.target.value)),\n            },\n            boardSizes.map((n) => m("option", n)),\n            mdl.size\n          ),\n        ],\n}\n\nconst GameOver = {\n  oncreate: () => window.scrollTo(0, 0),\n  view: ({ attrs: { mdl } }) =>\n    m(\n      ".game-over",\n      { onclick: (e) => restart(mdl) },\n      `Game Over ${mdl.winner} is the winner!`\n    ),\n}\n\nconst TicTacToe = {\n  view: () =>\n    m(".", [\n      m(Toolbar, { mdl }),\n      mdl.winner && m(GameOver, { mdl }),\n      m(Game, { mdl }),\n    ]),\n}\n\nm.mount(document.getElementById("TicTacToe"), TicTacToe)';
exports.TTT = TTT;

});

require.register("components/snippets/TTT/TTT_CSS.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TTT_CSS = void 0;
var TTT_CSS = "\n* {\n  box-sizing: border-box;\n  font-family: 'Mansalva';\n}\n\nselect {\n  width: 80px;\n  height: 36px;\n  font-size: 30px;\n}\n\n.toolbar {\n  border: 1px solid green;\n  display: flex;\n  flex-flow: wrap;\n  justify-content: space-between;\n}\n\n.score-card {\n  padding: 10px;\n  font-size: 30px\n}\n\n.game {\n  display: flex;\n  flex-flow: wrap;\n}\n\n\n.space {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid green;\n  cursor:pointer;\n}\n\n.game-over {\n  position: absolute;\n  top: 15%;\n  left: 15%;\n  width: 500px;\n  font-size: 90px;\n  background: #bdc3c7;\n  padding: 4px;\n  cursor: pointer;\n}\n\n.value {\n  font-size: inherit;\n}";
exports.TTT_CSS = TTT_CSS;

});

require.register("components/snippets/TTT/TTT_HTML.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TTT_HTML = void 0;
var TTT_HTML = '<link href="https://fonts.googleapis.com/css?family=Mansalva&display=swap" rel="stylesheet">\n<div id="TicTacToe"></div>';
exports.TTT_HTML = TTT_HTML;

});

require.register("components/snippets/TTT/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  TTT_URL: true
};
exports.TTT_URL = void 0;

var _TTT = require("./TTT.js");

Object.keys(_TTT).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _TTT[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _TTT[key];
    }
  });
});

var _TTT_CSS = require("./TTT_CSS.js");

Object.keys(_TTT_CSS).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _TTT_CSS[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _TTT_CSS[key];
    }
  });
});

var _TTT_HTML = require("./TTT_HTML.js");

Object.keys(_TTT_HTML).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _TTT_HTML[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _TTT_HTML[key];
    }
  });
});
var TTT_URL = "https://flems.io/#0=N4IgtglgJlA2CmIBcAGANCAzgYwE4HtZZkBtdFAXQwDMIFNTQA7AQzESRADoALAFzDEM2fEz7wxyEAB5YEJgGsABD1zxqAXgA6IfnwAOmJAHpj1UX0xcA5vnzWELfRCsiwx7JkwB+amzoAnhoAsixMmCywAG4sAGRQLvqwLEGYAO5OOkpqsNpYfAH0PPDwfDoAfCAYmPAI2HwQogycKEgArABMALStAGwoIAC+aMxsHNwAVgzCFhJ8UiLhfErWpQBKYVD4YACSYkoaSgAUkExoSmAsAB4AlAflSqF8PFzUsHa4R08vuJvbR3cAFTHACMSgA1Bdrkouhd5HdIacblomCjFphlkkUvBcJgDkpgCilEo+LgAK7wJAEnD4NSoc6XXAKKkAcgAGiylMMiUo-LAalTgDS6Up0FCmayAPIs7lMQZoprLABG+BYuCgAGUIAAveB4w5rV50cSfI5MO4aB5MJQAUiUAGYDocUEo0IbfkxVkd0P0bsjUQH0ctVnwACIQFjWACCeHwXgORxY2Gw5xqfHO0Fu9wJPIQy1w+KT2C4i2wLD4RzTJEzFH9xLUfDJuGtuBR8sDipWpXDkdD+DS1o0ieTqdKGagWctOetSjz2ULyZLojLFaraa4CE9zxhx0zEKUIJutZ5DabLbbKIVSyUaXkTHk1g1pQAQgF8WA4NnCTOINQTnAuEwHV4DuYBiWJHliTnTB9CTPV8XdMIvRBc5-1gQDgKUYEP3QoDdX3Q863A6DSkwGMCHjA1AKSCA+AAUSiHEAjQjDdVTWDsD1IioNKJQ00wPsBwQrhSTCGC43gStSPIuNMG42deP4nto1jSi+Ok1SrDUKAyU4o4Q2UmSvHOEhjxnHjliUiNrEEwd1MsWyuG03TJIM6zbJMszwIU5ZbyYe9PX1eyyM0pcmBXKSHP7c0woikgrMjIzMAoWLyyOeLSOU2za3k09mxvO8H0wHlBiUWoamnby1AxNUKxwoj23bK8MQuT9Dm-Yk-KYHEn0sJBTLQHkupxJAmDJIhBpnRtmypUkKUm4ksQCHFMHOHkVTVKBRvG2AFr44CqXQIboGeKkAA4UBQC8O2vRkFCfOpxE1Dj4HxNDzgUeAAgZNUFAtB4OqUIM+Je4TaFgE0jkNfQCH0OiAEcjhZT6AhZD6vpuNAcK4Db1SIucyX0KBy3gZ64OEtMoY3CRMAABVhpGYlgCkWUxu7zkNYoWCgSsXsx1r0NxqB8d4+QoHgK4wbFvZxauKmYfwOHEeRr60ZRv0WKFojsaF-ElENeQalwCsxYltBCeJp6NRet0uFvZ58DJVcbZ11U8aIvLrRw67muWO6NiYLYwGt8nDhwr9c14+AwH0AoQ84oLXc2o0IZxeXYYRxnIhZtAWVZkXlijHZ49ew5o9jgIS8wEgQwDoO9grMVy7jl6rE3axt1hQ8KB5ABCbHhoLWJYiUIuS6UYfxXul60JuI4x75k9SjPAWffCzsLZJgAVFew7agGeWx6a7P7gDj6X4+BYguVL3X68XAAdUKz1x8Od6lHViOZznJmKWEhX9BZ2ZvANGnN4DcypuDSG0MM7KxRmjD+GMsYAS1n6SOllSLCWsAQQmr4jjYGzNgEgIJayazdlALglxAEwMVpgdKKtUa51-iAnKBdEEBCCoaFGdDDTUAIGAWmLAIC4kitXZhOVKFOCOAAOTJGAJUOI2GPzvDid8AFB69SsFQyK2Z1zwEYrgZiKNszcK4PIbAzNxZ0PVn6Mx4VLF6iOHNECF8V7KP8jiNewNsDFGwAoHY1BQy-DSGo2AX9iS-iOL3aGzM-FAJzknPGdiLFkisUjfOlVwIDxUQWQ4LJpH4CUJKbqnIlCQWyMvfK3tzLtnAp7VeN8botTuq-K+U4YKhwBtfCySglqqL3uhPpuISBHzPClO6PJInuICo+GeLTajwHqKTEu78OmcS4Cjc4vTkjLVwPzNZ8ANkY1AuU7GQzq6jObClYUr1wTglOeonJ+IhnlPqdU4ktSga+P8YE4Js9XFVLgF4zs3Urh8B3vlQ4xwcLsTgv9TJ9TDRuH0BJI4m9xAQrOGU8yU867bBLntYk6L4CYsJVPFZ9U9pzwOR7SpXsgWNN9hUmqxtQnhIFnbJ5hwxpEEPgBPCpdRR8sFuQ-EPLYDCs5VAbchwLpXUZXfZpLBPrPnIU-Z4Wp8JvxhftXU8LAbYwFfiAVkrdZUQ9F6dARrgQCpuJIwBg4HhHGACjKk1pIQoSUMw1kMo0EzmyR43Amj8RdQfL1PB9VgXXlaYDKIEB4BpCpM68spIjDAB1ZskGcFBiDH+pBMASNqJwQQYDbyGJCiUlLd5XkFhNWUgAAYABJgAsVvNKngxhDXARuMYDogx9BXHrWS7yxQIDWH4FSJtLbsnts7fy7tvb+2DuHbyBAVwkD1rBGCZtM7nhztwsBJd9bZTVqUMuOQfiqSlweKfdCg8J4j17gcrgzCH1KFBeCs8qy+Ynurc+19k8C0shfdnEBsL1nML9U1AMTLaY7J6iINQ+Iq1xoTUoJNwAU24iQMAIZDI4A5vhUBwCiH4BdDLOqBBJAhmSKZLnJACCaM3LMtB4GW87CwCVGqZDPJUOJuOJhvgqacM4UI-cU5ha+Aca47gKj5TiRAaVE7KTTAcZ8CYGjYA56ICXrKtmaqfBaqz2GEofJaGADiYxWZkslEqCYiy+BHI4Sxc5drtFHDw0oTMeacUKaOHB7EQbSPnBdV9JAmZzhDKpOc6j8HcBUAFrm+SLHb7A0s+wHjM4+NJvhQ8kVm0lDeAuIW6wVmQvloQDhttp0p27p4EenN+H8vqntUcXmcLszyeKwSgkrrn2ZoOU13NSg-WnqpCQYrLIeAgjRiyGoj0lAsCULrAV1muveSA-NhzJbvVdrYme8KPAkKUj01OS4Kq1W0R4HW9+sj5Fp0OYZ3AIYQPAL9L+09xIhZ1q0VIx1k3FYNFEAg80mN1tZPnXqnuCq0tjElAYzLxJlxqBJjl7MfkthpBIwQIg7HvRoBQGDrL8b+PJqE9h9NBHhuWgk8B0r7Auj4AMSW7Tl7r3Mqe3VOANwTP1vS69eHqid2PMDaVFwJJigFUDb3et-pWOdi3jpreSZ2OCtjSTpAAJszEbk-6o47HCAyZC6JonCmRfdSHiPAt-PBe4GNwR03xX+f29gLmlEKWYNMDAJQx2YgjhbGwHIuYON8BQG+koRX2BldR-wCBKoIBkV0BxFILjCihBYAWfURo4QpAghBL0JAHQQRDBGCAVg7ApAli8PHxY4hJCcBRMCQGKorhdDwg+KkKp1Q4i6C3gA3DycwYguh+EgLAAIrJQjhEiDEFkA+FVbfqJk6rPBzooAHfP4ko7x18CpPaXoG-B8WDbwdB06+rjz+gyJaT3Hm+0nFrgKkIIB18UINAFYagJCb6UAkGCOyqRvASzf6AGt5vD9hUhpC-D6Df4TBkgYi-gBDkazBiBUgHK96lBpAlBMCX63wka0hkYUZQCZKwQwAd4Hjn7AHH4Cp77n5rw2BjCZK-5LQAFrrAFroj7vD8aQFOA4Ge5FqcSMGJD-6rpAE8iRBjpMBdC0TRxGBAxzA4gwFwENDUCIG15zBUicRiAKHrT34jQHgv6YBv5EHYJYHf6B64i0hIAoryAmi8Eoj0EM5M6qKAwopARA5MBUgsBKiGHMziDf5Sb6BP5tA2jf4IDUC74HjBHf4r5UhtCXSH4zhD58An66hUgACcFB60SYCg2CvuW0SgAAxEqFANgPaNgAAOzf4kEJCehUgAAsCRxI5hhhj+vS+ANh2hCqr2f8gMSRKRJ28gxQuAtEl+8ei+7hzQIAdRBeIIZ0QwVAIAcgigzQJAowFenAkAzwwx6eTYxAnAeghgJgxgZITA+gORS47gmxqgdAAAAh0FwCgFwHUZ2ldtsZQvIFwFMPHgUPoOMDgMMbHCXmseML8B+CwPHrsVIAcUYKYCcWcdYBccYKCcTDcY8R0L0FwCCMYL-nwEiWwMTO8apl8RgD8X8XgBAICcMMCVIFcdsW3qSOAmABCbgHsboEJocbCacecW4C8VsXQPSSjmAHcQ8Q8cYBiIKZ8dMCAKSVIP8RSfMIMBQIMEAA";
exports.TTT_URL = TTT_URL;

});

require.register("components/snippets/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShapeShifter = exports.GameOfLife = exports.TicTacToe = void 0;

var _index = require("./TTT/index");

var _index2 = require("./GOL/index");

var _index3 = require("./SHAPE/index");

var MITHRIL = {
  name: "mithril",
  type: "js",
  url: "https://unpkg.com/mithril"
};
var TicTacToe = {
  id: "TicTacToe",
  title: "Tic Tac Toe",
  url: _index.TTT_URL,
  code: {
    files: [{
      name: "app.js",
      content: _index.TTT
    }, {
      name: "style.css",
      content: _index.TTT_CSS
    }, {
      name: "index.html",
      content: _index.TTT_HTML
    }],
    links: [MITHRIL, {
      name: "ramda",
      type: "js",
      url: "https://unpkg.com/ramda@0.26.1/dist/ramda.min.js"
    }, {
      name: "mithril-stream",
      type: "js",
      url: "https://unpkg.com/mithril-stream@2.0.0/stream.js"
    }]
  }
};
exports.TicTacToe = TicTacToe;
var GameOfLife = {
  id: "GameOfLife",
  title: "Game Of Life",
  url: _index2.GOL_URL,
  code: {
    files: [{
      name: "app.js",
      content: _index2.GOL
    }, {
      name: "style.css",
      content: _index2.GOL_CSS
    }, {
      name: "index.html",
      content: _index2.GOL_HTML
    }],
    links: [MITHRIL, {
      name: "ramda",
      type: "js",
      url: "https://unpkg.com/ramda@0.26.1/dist/ramda.min.js"
    }, {
      name: "mithril-stream",
      type: "js",
      url: "https://unpkg.com/mithril-stream@2.0.0/stream.js"
    }]
  }
};
exports.GameOfLife = GameOfLife;
var ShapeShifter = {
  id: "DynamicSVGManipulation",
  title: "Dynamic SVG Manipulation",
  url: _index3.SHAPE_URL,
  code: {
    files: [{
      name: "app.js",
      content: _index3.SHAPE
    }, {
      name: "style.css",
      content: _index3.SHAPE_CSS
    }, {
      name: "index.html",
      content: _index3.SHAPE_HTML
    }],
    links: [MITHRIL]
  }
};
exports.ShapeShifter = ShapeShifter;

});

require.register("components/walkabout.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Walkabout = void 0;
var Walkabout = {
  view: function view() {
    return m("#walk-container", m("#walk"));
  }
};
exports.Walkabout = Walkabout;

});

require.register("http.js", function(exports, require, module) {
"use strict";

});

require.register("index.js", function(exports, require, module) {
"use strict";

var _routes = _interopRequireDefault(require("./routes.js"));

var _model = _interopRequireDefault(require("./model.js"));

var _initMithrilInspector = require("./init-mithril-inspector");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = document.body;
var winW = window.innerWidth;

if (module.hot) {
  module.hot.accept();
}

if ('production' == "development") {
  console.log("Looks like we are in development mode!"); //mithril - inspector
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
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").then(function (registration) {
        console.log("⚙️ SW registered: ", registration);
      }).catch(function (registrationError) {
        console.log("🧟 SW registration failed: ", registrationError);
      });
    });
  }
} // set display profiles


var getProfile = function getProfile(w) {
  if (w < 668) return "phone";
  if (w < 920) return "tablet";
  return "desktop";
};

var checkWidth = function checkWidth(winW) {
  var w = window.innerWidth;

  if (winW !== w) {
    winW = w;
    var lastProfile = _model.default.settings.profile;
    _model.default.settings.profile = getProfile(w);
    if (lastProfile != _model.default.settings.profile) m.redraw();
  }

  return requestAnimationFrame(checkWidth);
};

_model.default.settings.profile = getProfile(winW);
checkWidth(winW);

if (sessionStorage.getItem("user")) {
  _model.default.user = JSON.parse(sessionStorage.getItem("user"));
}

m.route(root, "/home", (0, _routes.default)(_model.default));

});

require.register("init-mithril-inspector.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMithrilInspector = exports.getLocalMdl = exports.saveJsonMdl = exports.toDto = exports.sendMessage = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var sendMessage = function sendMessage(name, data) {
  return window.postMessage({
    source: "mithril-inspect-agent",
    name: name,
    msg: data || {}
  }, "*");
}; //mithril-inspector-setup


exports.sendMessage = sendMessage;

var addMithrilInspector = function addMithrilInspector() {
  window.addEventListener("mithril-inspect-agent", function (event) {
    // Only accept messages from same frame
    if (event.source !== window) {
      return;
    }

    var message = event.data; // Only accept messages of correct format (our messages)

    if (_typeof(message) !== "object" || message === null || message.source !== "mithril-inspect-devtools") {
      return;
    }

    console.log("need to handle this somehow", message);
  });
};

var toDto = function toDto(mdl) {
  return JSON.stringify(mdl);
};

exports.toDto = toDto;

var saveJsonMdl = function saveJsonMdl(mdl) {
  return localStorage.setItem("mithril-inspector", mdl);
};

exports.saveJsonMdl = saveJsonMdl;

var getLocalMdl = function getLocalMdl() {
  return localStorage.getItem("mithril-inspector");
};

exports.getLocalMdl = getLocalMdl;

var initMithrilInspector = function initMithrilInspector(mdl) {
  console.log("init mithril inspector");
  addMithrilInspector();
  var dto = toDto(mdl);
  saveJsonMdl(dto);
};

exports.initMithrilInspector = initMithrilInspector;

});

require.register("initialize.js", function(exports, require, module) {
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  require("./index.js");
});

});

require.register("model.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var model = {
  state: {
    isLoading: false,
    loadingProgress: {
      max: 0,
      value: 0
    },
    isLoggedIn: function isLoggedIn() {
      return sessionStorage.getItem("token");
    }
  },
  routes: ["/home", "/portfolio", "/snippets", // "/about",
  "/resume"],
  status: {
    sidebar: false
  },
  settings: {
    profile: "",
    inspector: ""
  },
  snippets: [],
  slug: ""
};
var _default = model;
exports.default = _default;

});

require.register("pages/about.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  view: function view() {
    return m("section", [m("code.intro-text", "After serving as a paratrooper in the IDF I spent the next decade in Academia studying the effects of changes in environment on Human Performance, from pregancy to sports-injuries to space-flight."), m("br"), m("code.intro-text", ["My background in programming started at a 3 month boot-camp at the Iron Yard in Houston (since closed) supplemented with various online courses ", m("a.intro-text", {
      href: "https://online-learning.harvard.edu/course/cs50-introduction-computer-science",
      target: "_blank"
    }, "from the Harvard CS50 course"), " to ", m("a.intro-text", {
      href: "https://www.youtube.com/watch?v=I8LbkfSSR58",
      target: "_blank"
    }, "Bartosz Milewski's Category Theory,"), " as well as working through An Introduction to Functional Programming Through Lambda Calculus,", m("a.intro-text", {
      href: "https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript",
      target: "_blank"
    }, " and Brian Lonsdorf's Professor Frisbies Egghead Course on FP in JS,"), m("a.intro-text", {
      href: "https://github.com/boazblake?tab=repositories",
      target: "_blank"
    }, " and lots of time spent on personal projects,"), "and on-the-job training (Agile, SCRUM). "]), m("br"), m("code.intro-text", "My current personal interests lie in the nexus of true object oriented programming - as per Alan Kay, and functional programming in JavaScript. I am also a fan of Douglas Crockford and Kyle Simpson’s philosophy of JavaScripts behavior delegation / Objects linked to other Objects and I favour composition over hierarchy.")]);
  }
};
exports.default = _default;

});

require.register("pages/home.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Home = void 0;

var _styles = require("styles");

var _utils = require("utils");

var _components = require("components");

var Home = {
  view: function view() {
    return m(".home", {
      oncreate: (0, _styles.AnimateChildren)(_styles.fadeInUp, (0, _utils.Pause)(0.05))
    }, [m(".frow", m("img#boazface", {
      src: "/images/boazface.webp"
    }), m(".frow.row-around", {
      padding: "2px"
    }, [m("a", {
      oncreate: (0, _styles.Animate)(_styles.popIn, _utils.randomPause),
      target: "_blank",
      href: "https://github.com/boazblake"
    }, m("img", {
      style: {
        margin: "2px",
        height: "100px",
        width: "100px"
      },
      src: "/images/github.svg"
    })), m("a", {
      oncreate: (0, _styles.Animate)(_styles.popIn, _utils.randomPause),
      target: "_blank",
      href: "https://www.linkedin.com/in/boazblake/"
    }, m("img", {
      style: {
        margin: "2px",
        height: "100px",
        width: "100px"
      },
      src: "/images/linkedin.svg"
    })), m(_components.Walkabout)])), m("p", m("code", {
      style: {
        color: "black",
        margin: "4px",
        fontSize: "2rem"
      }
    }, "Front-End developer with half a decade of industry experience building a variety of different applications using a multitude of different frameworks and languages.")), m("p", m("code", {
      style: {
        color: "black",
        margin: "4px",
        fontSize: "1rem"
      }
    }, "Contact:", "boazBlake at protonMail dot com"))]);
  }
};
exports.Home = Home;

});

require.register("pages/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _home = require("./home");

Object.keys(_home).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _home[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _home[key];
    }
  });
});

var _portfolio = require("./portfolio");

Object.keys(_portfolio).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _portfolio[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _portfolio[key];
    }
  });
});

var _snippets = require("./snippets");

Object.keys(_snippets).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _snippets[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _snippets[key];
    }
  });
});

var _resume = require("./resume");

Object.keys(_resume).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _resume[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _resume[key];
    }
  });
});

var _about = require("./about");

Object.keys(_about).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _about[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _about[key];
    }
  });
});

});

require.register("pages/portfolio.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Portfolio = void 0;

var _utils = require("utils");

var _styles = require("styles");

var RepoLink = {
  view: function view(_ref) {
    var url = _ref.attrs.url;
    return m("a.github-app-link", {
      href: "https://boazblake.github.io/".concat(url),
      target: "_blank",
      title: url
    }, url);
  }
};

var getRepos = function getRepos() {
  return m.request({
    url: "https://api.github.com/users/boazblake/repos?sort=asc&per_page=100",
    headers: {
      Accept: "application/vnd.github.v3+json"
    }
  });
};

var getRepo = function getRepo(state) {
  return m.request({
    url: "https://api.github.com/repos/boazblake/".concat(state.name)
  });
};

var Repo = function Repo() {
  var state = {
    name: "",
    status: "loading"
  };
  return {
    oninit: function oninit(_ref2) {
      var url = _ref2.attrs.url;
      state.name = url.split("/")[3];
      getRepo(state).then(function (_ref3) {
        var description = _ref3.description;
        state.errors = null;
        state.info = description && description.split("~")[0];
        state.src = description && description.split("~")[1];
        state.status = "loaded";
      }, function (errors) {
        state.status = "failed";
        state.errors = errors;
      });
    },
    view: function view() {
      return state.status == "loading" && "Repo Loading...", state.status == "failed" && "Error", state.status == "loaded" && m(".repo", m(".col-md-3-3", {
        oncreate: (0, _styles.Animate)(_styles.fadeIn, _utils.randomPause)
      }, [m(".repo-title", [m(RepoLink, {
        url: state.name
      })]), m("img", {
        width: "200px",
        src: state.src
      }), m(".info", state.info)]));
    }
  };
};

var Portfolio = function Portfolio() {
  var state = {
    status: "loading",
    repos: [],
    errors: {}
  };
  return {
    oninit: getRepos().then(function (repos) {
      state.status = "loaded";
      state.repos = repos.filter(function (repo) {
        return repo.homepage && repo.homepage.includes("boazblake") && repo.description && repo.description.split("~")[1];
      }).map(function (repo) {
        return repo.homepage;
      });
    }, function (errors) {
      state.status = "failed";
      state.errors = errors;
    }),
    view: function view(_ref4) {
      var mdl = _ref4.attrs.mdl;
      return m(".portfolio", m(".frow-container.frow", state.status == "failed" && "Error fetching Repos ...", state.status == "loading" && "Loading Repos ...", state.status == "loaded" && state.repos.map(function (url) {
        return m(Repo, {
          url: url,
          mdl: mdl
        });
      })));
    }
  };
};

exports.Portfolio = Portfolio;

});

require.register("pages/resume.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resume = void 0;

var _styles = require("styles");

var _utils = require("utils");

var Resume = function Resume() {
  return {
    view: function view() {
      return m(".frow-container", {
        oncreate: (0, _styles.AnimateChildren)(_styles.fadeInUp, (0, _utils.Pause)(0.15))
      }, [m("a", {
        href: "files/resume.pdf",
        title: "Boaz Blake Web Dev Resume",
        download: "files/resume.pdf"
      }, "Download PDF"), m("img.resume-img", {
        id: "resume-1",
        src: "/images/resume.webp"
      }), m("img.resume-img", {
        id: "resume-2",
        src: "/images/resume 2.webp"
      })]);
    }
  };
};

exports.Resume = Resume;

});

require.register("pages/snippets.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Snippets = void 0;

var _components = require("components");

var _utils = require("utils");

var snippets = [_components.TicTacToe,, _components.GameOfLife, _components.ShapeShifter];
var Snippet = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        snip = _ref$attrs.snip,
        Flems = _ref$attrs.Flems;
    return m(".snippet", [m("a.snippet-title", {
      href: snip.url,
      target: "__blank"
    }, snip.title), m(".snippet-code", {
      id: snip.id,
      style: {
        height: "500px"
      },
      oncreate: function oncreate(_ref2) {
        var dom = _ref2.dom;
        return Flems(dom, (0, _utils.jsonCopy)(snip.code));
      }
    })]);
  }
};

var Snippets = function Snippets(_ref3) {
  var mdl = _ref3.attrs.mdl;
  return {
    view: function view() {
      return m(".snippets", snippets.map(function (snip) {
        return m(Snippet, {
          snip: snip,
          Flems: window.Flems
        });
      }));
    }
  };
};

exports.Snippets = Snippets;

});

require.register("routes.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _components = require("components");

var _styles = require("styles");

var _pages = require("pages");

var routes = function routes(mdl) {
  return {
    "/home": {
      onmatch: function onmatch(_, b) {
        mdl.slug = b;
        mdl.status.sidebar = false;
        window.scrollTo(0, 0);
      },
      render: function render() {
        return m(_components.Layout, {
          mdl: mdl
        }, m(_pages.Home, {
          oncreate: (0, _styles.AnimatePage)(_styles.slideInRight),
          onscroll: function onscroll(e) {
            return console.log(e);
          },
          onbeforeremove: (0, _styles.AnimatePage)(_styles.slideOutLeft),
          mdl: mdl
        }));
      }
    },
    "/portfolio": {
      onmatch: function onmatch(_, b) {
        mdl.slug = b;
        mdl.status.sidebar = false;
        window.scrollTo(0, 0);
      },
      render: function render() {
        return m(_components.Layout, {
          mdl: mdl
        }, m(_pages.Portfolio, {
          oncreate: (0, _styles.AnimatePage)(_styles.slideInRight),
          onscroll: function onscroll(e) {
            return console.log(e);
          },
          onbeforeremove: (0, _styles.AnimatePage)(_styles.slideOutLeft),
          mdl: mdl
        }));
      }
    },
    "/resume": {
      onmatch: function onmatch(_, b) {
        mdl.slug = b;
        mdl.status.sidebar = false;
        window.scrollTo(0, 0);
      },
      render: function render() {
        return m(_components.Layout, {
          mdl: mdl
        }, m(_pages.Resume, {
          oncreate: (0, _styles.AnimatePage)(_styles.slideInRight),
          onscroll: function onscroll(e) {
            return console.log(e);
          },
          onbeforeremove: (0, _styles.AnimatePage)(_styles.slideOutLeft),
          mdl: mdl
        }));
      }
    },
    "/snippets": {
      onmatch: function onmatch(_, b) {
        mdl.slug = b;
        mdl.status.sidebar = false;
        window.scrollTo(0, 0);
      },
      render: function render() {
        return m(_components.Layout, {
          mdl: mdl
        }, m(_pages.Snippets, {
          oncreate: (0, _styles.AnimatePage)(_styles.slideInRight),
          onscroll: function onscroll(e) {
            return console.log(e);
          },
          onbeforeremove: (0, _styles.AnimatePage)(_styles.slideOutLeft),
          mdl: mdl
        }));
      }
    },
    "/about": {
      onmatch: function onmatch(_, b) {
        mdl.slug = b;
        mdl.status.sidebar = false;
        window.scrollTo(0, 0);
      },
      render: function render() {
        return m(_components.Layout, {
          mdl: mdl
        }, m(_pages.About, {
          oncreate: (0, _styles.AnimatePage)(_styles.slideInRight),
          onscroll: function onscroll(e) {
            return console.log(e);
          },
          onbeforeremove: (0, _styles.AnimatePage)(_styles.slideOutLeft),
          mdl: mdl
        }));
      }
    }
  };
};

var _default = routes;
exports.default = _default;

});

require.register("styles/animations.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sideBarChildren = exports.sideBarIn = exports.slideInDown = exports.slideOutRight = exports.slideInLeft = exports.slideInRight = exports.fadeInUp = exports.fadeIn = exports.popIn = void 0;
var popIn = [{
  transform: "scale(0)",
  opacity: 1
}, {
  transform: "scale(1)",
  opacity: 1
}, {
  transform: "scale(0.8)",
  opacity: 1
}, {
  transform: "scale(1)",
  opacity: 1
}];
exports.popIn = popIn;
var fadeIn = [{
  opacity: 0
}, {
  opacity: 1
}];
exports.fadeIn = fadeIn;
var fadeInUp = [{
  opacity: 0,
  transform: "translate3d(0, 40%, 0)"
}, {
  opacity: 1,
  transform: "translate3d(0, 0, 0)"
}];
exports.fadeInUp = fadeInUp;
var slideInRight = [{
  transform: "translate3d(-50%, 0, 0)"
}, {
  transform: "translate3d(0, 0, 0)",
  visibility: "visible"
}];
exports.slideInRight = slideInRight;
var slideInLeft = [{
  transform: "translate3d(80%, 0, 0)",
  visibility: "visible"
}, {
  transform: "translate3d(0, 0, 0)"
}];
exports.slideInLeft = slideInLeft;
var slideOutRight = [{
  transform: "translate3d(0, 0, 0)"
}, {
  visibility: "hidden",
  transform: "translate3d(100%, 0, 0)"
}];
exports.slideOutRight = slideOutRight;
var slideInDown = [{
  transform: "translate3d(0, -50%, 0)"
}, {
  transform: "translate3d(0, 0, 0)",
  visibility: "visible"
}];
exports.slideInDown = slideInDown;

var sideBarIn = function sideBarIn() {
  var animation = Object.assign(slideInLeft);
  animation[1].background = "black";
  return animation;
};

exports.sideBarIn = sideBarIn;

var sideBarChildren = function sideBarChildren() {
  var animation = Object.assign(slideInRight);
  animation[1].color = "white";
  return animation;
};

exports.sideBarChildren = sideBarChildren;

});

require.register("styles/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  AnimatePage: true,
  Animate: true,
  AnimateChildren: true
};
exports.AnimateChildren = exports.Animate = exports.AnimatePage = void 0;

var _utils = require("utils");

var _animations = require("./animations.js");

Object.keys(_animations).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _animations[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _animations[key];
    }
  });
});

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var duration = {
  duration: 700,
  easing: "ease-in-out",
  fill: "forwards"
};

function transitionEndPromise(element) {
  var transitionEnded = function transitionEnded(e) {
    // console.log("transitionEnded", element, e)
    if (e.target !== element) return;
    element.removeEventListener("transitionend", transitionEnded);
  };

  return new Promise(function () {
    return element.addEventListener("transitionend", transitionEnded);
  });
}

var AnimatePage = function AnimatePage(animation) {
  return function (_ref) {
    var dom = _ref.dom;
    // let origStyles = jsonCopy(dom.style)
    // dom.style.position = "absolute"
    // dom.style.top = -19
    // dom.style.width = "100%"
    Animate(animation)({
      dom: dom
    }); // Animate(animation)({ dom })
  };
};

exports.AnimatePage = AnimatePage;

var Animate = function Animate(animation) {
  var pause = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _utils.NoOp;
  return function (_ref2) {
    var dom = _ref2.dom;
    return setTimeout(function () {
      return dom.animate(animation, duration).finished.then(transitionEndPromise(dom));
    }, pause());
  };
};

exports.Animate = Animate;

var AnimateChildren = function AnimateChildren(animation, pause) {
  return function (_ref3) {
    var dom = _ref3.dom;

    var children = _toConsumableArray(dom.children);

    children.map(function (child, idx) {
      child.style.opacity = 0;
      setTimeout(function () {
        child.style.opacity = 1;
        Animate(animation)({
          dom: child
        });
      }, pause());
    });
  };
};

exports.AnimateChildren = AnimateChildren;

});

require.register("utils.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = exports.isSideBarActive = exports.jsonCopy = exports.nameFromRoute = exports.NoOp = exports.Pause = exports.randomPause = exports.log = void 0;

var _mithrilStream = _interopRequireDefault(require("mithril-stream"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var log = function log(m) {
  return function (v) {
    console.log(m, v);
    return v;
  };
};

exports.log = log;

var secureImg = function secureImg(url) {
  return url.match(/(https)./) ? url : url.replace("http:", "https:");
};

var randomPause = function randomPause() {
  return Math.random() * 1000;
};

exports.randomPause = randomPause;

var Pause = function Pause(n) {
  return (0, _mithrilStream.default)(n * 1000);
};

exports.Pause = Pause;

var NoOp = function NoOp() {};

exports.NoOp = NoOp;

var nameFromRoute = function nameFromRoute(route) {
  return route.split("/")[1].toUpperCase();
};

exports.nameFromRoute = nameFromRoute;

var jsonCopy = function jsonCopy(data) {
  return JSON.parse(JSON.stringify(data));
};

exports.jsonCopy = jsonCopy;

var isSideBarActive = function isSideBarActive(mdl) {
  return mdl.settings.profile !== "desktop" && mdl.status.sidebar;
};

exports.isSideBarActive = isSideBarActive;

var range = function range(size) {
  return _toConsumableArray(Array(size).keys());
};

exports.range = range;

});

require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.m = require("mithril");


});})();require('___globals___');

require('initialize');