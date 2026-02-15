'use strict'

const MINE = '💣'
const FLAG = '🚩'
// const SMILEYNORMAL = ''
var firstClick = true

const gLevel = {
  SIZE: 4,
  MINES: 2
}

const gGame = {
  isOn: false,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0
}

var gBoard


function onSetLevel(size, mines) {
  gLevel.SIZE = size
  gLevel.MINES = mines
  onInit()
}

function onInit() {
  firstClick = true
  document.querySelector('.timer').innerText = '000'
  gBoard = buildBoard()
  renderBoard(gBoard)

  //TODO: Make it so that upon the first click, two sequences are initated:
  //1. Start the timer that will count exclusively in seconds, and stop when the game is over (also implement an inner save that will keep track of the shortest time beaten)
  //2. Implement the desired reaction where the mines and the numbered cells are generated during the first click and not prior.
}

function buildBoard() {
  const board = createMat(gLevel.SIZE)

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      board[i][j] = {
        pos: { i: i, j: j },
        minesAroundCount: 0,
        isRevealed: false,
        isMine: false,
        isMarked: false
      }
    }
  }

  board[1][2].isMine = true
  board[3][3].isMine = true
  return board
}

function setTotalMinesCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) { 
       board[i][j].minesAroundCount = setMinesNegsCount(board[i][j])
    }
  }
}

function setMinesNegsCount(cell) {
  var count = 0
  for (var i = cell.pos.i - 1; i <= cell.pos.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = cell.pos.j - 1; j <= cell.pos.j + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue
      if (gBoard[i][j].isMine) count++
    }
  }
  return count
}

function renderBoard(board) {

  var strHTML = '<table><tbody>'
  for (var i = 0; i < board.length; i++) {

    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {

      const cell = board[i][j]
      const className = `cell cell-${i}-${j}`
      if (!cell.isRevealed) {
        strHTML += `<td class="${className}">
                      <button onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})">
                  </button>
                  </td> `
      } else if (cell.isRevealed) {
        strHTML += `<td class="${className}">${cell.minesAroundCount}</td>`
      }
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elContainer = document.querySelector('.board-container')
  elContainer.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
  if (gBoard[i][j].isRevealed) return
  if (firstClick) {
    firstClick = false
    setTotalMinesCount(gBoard)
  }
  gBoard[i][j].isRevealed = true
  if (gBoard[i][j].isMine) {
    gBoard[i][j].isRevealed = true
    renderCell(gBoard[i][j].pos, MINE);
    //checkGameOver()
    return
  } 
  
  //expandReveal(gBoard, elCell, i, j)
  renderBoard(gBoard)
}

function onCellMarked(elCell, i, j) {
  if (gBoard[i][j].isRevealed) return
  //1.how to stop "context menu" 2. need to turn board[i][j].isMarked = true  
  gBoard[i][j].isMarked = true
  if (gBoard[i][j].isMarked) {
    renderCell(gBoard[i][j].pos, FLAG);
  } 
  renderBoard(gBoard)
}

function checkGameOver() {
  //TODO: 
}

function expandReveal(board, elCell, i, j) {
  //TODO: make it so cells clicked that have their .minesAroundCount = 0 also reveal other neighboring cells of the same attribute,
  //then stop at cells that have their .minesAroundCount > 0, and also not reveal any mines.
}

function renderCell(pos, value) {
    const selector = `.cell-${pos.i}-${pos.j}`
    const elCell = document.querySelector(selector)
     console.log(pos, value, elCell);
     
    if (elCell) {
      elCell.innerHTML = value
    } else {
      console.error('element not found')
    }
}

// function onCellClicked(elCell, clickedNum) {
//     if (clickedNum !== gCurrNum) return
//     if (clickedNum === 1) {
//         startTimer()
//     } else if (clickedNum === gNums.length) {
//         victory()
//         return
//     }
//     gCurrNum++
//     document.querySelector('h2 span').innerText = gCurrNum
//     elCell.classList.add('clicked')
// }

function startTimer() {
  const elTimer = document.querySelector('.timer')
  const startTime = Date.now()

  gIntervalId = setInterval(() => {
    const timeDiff = Date.now() - startTime
    const totalTime = getPassedTimeF(timeDiff)
    elTimer.innerText = totalTime
  }, 10)
}


