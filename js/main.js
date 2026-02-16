'use strict'

const MINE = '💣'
const FLAG = '🚩'
const LIFE = '💓'
const HINT = '🔅'
// const SMILEYNORMAL = ''
var firstClick = true
var gLives
var gIntervalId
var hiScore

const gLevel = {
  SIZE: 4,
  MINES: 2,
  LIFE: 1
}

const gGame = {
  isOn: false,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0
}

var gBoard
//localStorage.setItem('hiScore', score)
//localStorage.getItem('hiScore')

function onSetLevel(size, mines, lives) {
  gLevel.SIZE = size
  gLevel.MINES = mines
  gLevel.LIFE = lives
  onInit()
}

function onInit() {
  clearInterval(gIntervalId)
  gIntervalId = null
  firstClick = true
  gLives = gLevel.LIFE
  document.querySelector('.timer').innerText = '00:000'
  document.querySelector('.life-container').innerText
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

  // board[1][2].isMine = true
  // board[3][3].isMine = true
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
        if (cell.isMarked) {
          strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(event, ${i}, ${j})">${FLAG}</td>`
        } else {
          strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(event, ${i}, ${j})">
                  </td> `
        }
      } else if (cell.isRevealed && !cell.isMine) {
        strHTML += `<td class="${className}">${cell.minesAroundCount}</td>`
      } else if (cell.isMine && cell.isRevealed) {
        strHTML += `<td class="${className}">${MINE}</td>`
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
    randomizeMinesLocation(i, j, gBoard, gLevel.MINES)
    setTotalMinesCount(gBoard)
    startTimer()
  }
  gBoard[i][j].isRevealed = true
  gGame.revealedCount++
  if (gBoard[i][j].isMine) {
    if (gLives > 0) {
      gBoard[i][j].isRevealed = true
      gLives--
    } else {
      gameOver()
    }
  }
  console.log(gBoard[i][j]);
  //expandReveal(gBoard, elCell, i, j)
  renderBoard(gBoard)
}

function onCellMarked(event, i, j) {
  event.preventDefault()
  console.log(gBoard[i][j]);

  if (gBoard[i][j].isRevealed) return
  if (gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = false
    gGame.markedCount--
  } else {
    gBoard[i][j].isMarked = true
    gGame.markedCount++
  }
  renderBoard(gBoard)
}

function checkGameOver() {
  var cellsRevealed = gGame.revealedCount 
    for (var i = 0; i < gBoard.length; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = 0; j < gBoard[0].length + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue
      //if ()
      //TODO: pass on every cell a compare to all the counts within gGame
    }
  }
}

function gameOver() {
  const elModal = document.querySelector('.modal')
  clearInterval(gIntervalId)
   //localStorage.setItem('hiScore', score)
   //localStorage.getItem('hiScore')
}

function expandReveal(board, elCell, i, j) {
  //TODO: make it so cells clicked that have their .minesAroundCount = 0 also reveal other neighboring cells of the same attribute,
  //then stop at cells that have their .minesAroundCount > 0, and also not reveal any mines. If isMine = true, reveal all mines. 
}

// function renderCell(selector, pos, value) {
//     const elCell = document.querySelector(selector)
//      console.log(pos, value, elCell);

//     if (elCell) {
//       elCell.innerHTML = value
//     } else {
//       console.error('element not found')
//     }
// }

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

function randomizeMinesLocation(idxI, idxJ, board, amount) {
  for (var i = 0; i < amount; i++) {
    let cell = getRandomEmptyCell(idxI, idxJ)
    board[cell.i][cell.j].isMine = true
  }
}

