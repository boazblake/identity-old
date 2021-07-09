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
