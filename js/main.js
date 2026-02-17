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
  LIFE: 2
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

var remainingFlags = gLevel.MINES

function onInit() {
  clearInterval(gIntervalId)
  const elModal = document.querySelector('.modal')
  elModal.classList.add('hidden')
  gIntervalId = null
  firstClick = true
  gLives = gLevel.LIFE
  gGame.revealedCount = 0
  gGame.markedCount = 0
  remainingFlags = gLevel.MINES
  const elFlagCounter = document.querySelector('.flags-remaining')
  elFlagCounter.innerHTML = remainingFlags
  document.querySelector('.timer').innerText = '00:000'
  renderHealth()
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

  if (gBoard[i][j].isMine) {
    if (gLives > 0) {
      gBoard[i][j].isRevealed = true
      renderBoard(gBoard)
      gLives--
      renderHealth()
      if (gLives === 0) {
        gameOver()
        return
      }
      setTimeout(() => {
        gBoard[i][j].isRevealed = false
        renderBoard(gBoard)
      }, 1000)
    }
    return
  }
  gBoard[i][j].isRevealed = true
  gGame.revealedCount++
  console.log(gBoard[i][j]);
  //expandReveal(gBoard, elCell, i, j)
  renderBoard(gBoard)
  checkGameOver()
}

function onCellMarked(event, i, j) {
  event.preventDefault()
  const elFlagCounter = document.querySelector('.flags-remaining')
  console.log(remainingFlags)

  if (gBoard[i][j].isRevealed) return
  if (gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = false
    gGame.markedCount--
    remainingFlags++
  } else {
    gBoard[i][j].isMarked = true
    gGame.markedCount++
    remainingFlags--
  }
  console.log(remainingFlags);
  renderBoard(gBoard)
  elFlagCounter.innerHTML = remainingFlags
}

function checkGameOver() {
  var cellsRevealed = gGame.revealedCount
  var totalMines = gLevel.MINES
  var flaggedCount = gGame.markedCount
  var totalCells = gLevel.SIZE ** 2
  console.log(cellsRevealed, flaggedCount, totalCells)
  if (cellsRevealed + flaggedCount === totalCells && flaggedCount === totalMines) {
    isVictory()
  }
}

function gameOver() {
  clearInterval(gIntervalId)
  const elModal = document.querySelector('.modal')
  elModal.innerText = 'Kablooey! you lose...'
  elModal.classList.remove('hidden')
}

function isVictory() {
  clearInterval(gIntervalId)
  const elModal = document.querySelector('.modal')
  elModal.innerText = 'Congatulations!'
  elModal.classList.remove('hidden')
 
  //  localStorage.setItem('hiScore', score)
  //  localStorage.getItem('hiScore')
}

function expandReveal(board, elCell, i, j) {
  //TODO: make it so cells clicked that have their .minesAroundCount = 0 also reveal other neighboring cells of the same attribute,
  //then stop at cells that have their .minesAroundCount > 0, and also not reveal any mines. If isMine = true, reveal all mines. 
}

function renderHealth() {
  const elHealthBar = document.querySelector('.healthbar')
  var currentHealth = ''
   for (var i = 0; i < gLives; i++) {
     currentHealth += LIFE
   }
  elHealthBar.innerText = currentHealth
}

// function renderCell(pos, value) {
//     const elCell = document.querySelector(selector)
//      console.log(pos, value, elCell);

//     if (elCell) {
//       elCell.innerHTML = value
//     } else {
//       console.error('element not found')
//     }
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

