'use strict'

const MINE = '💣'
const FLAG = '🚩'
const LIFE = '💓'
const HINT = '🔅'
const SMILEYNORMAL = '🙂'
const SMILEYHAPPY = '😀'
const SMILEYDEAD = '💀'
const SMILEYWIN = '😎'
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
  gGame.isOn = true
  const elModal = document.querySelector('.modal')
  const elFlagCounter = document.querySelector('.flags-remaining')
  document.querySelector('.timer').innerText = '00:000'
  document.querySelector('.smiley-face').innerText = SMILEYNORMAL
  elModal.classList.add('hidden')
  remainingFlags = gLevel.MINES
  elFlagCounter.innerHTML = remainingFlags

  gIntervalId = null
  firstClick = true
  gLives = gLevel.LIFE
  gGame.revealedCount = 0
  gGame.markedCount = 0

  renderHealth()
  gBoard = buildBoard()
  renderBoard(gBoard)
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
  if (gBoard[i][j].isRevealed || !gGame.isOn) return
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
  if (gBoard[i][j].minesAroundCount === 0) {
    expandReveal(gBoard, elCell, i, j)
  }
  document.querySelector('.smiley-face').innerText = SMILEYHAPPY
  if (gGame.isOn) {
    setTimeout(() => {
      document.querySelector('.smiley-face').innerText = SMILEYNORMAL
    }, 1000)
  }
  renderBoard(gBoard)
  checkGameOver()
}

function onCellMarked(event, i, j) {
  event.preventDefault()
  const elFlagCounter = document.querySelector('.flags-remaining')
  console.log(remainingFlags)

  if (gBoard[i][j].isRevealed || !gGame.isOn) return
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
  checkGameOver()
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
  gGame.isOn = false
  const elModal = document.querySelector('.modal')
  elModal.innerText = 'Kablooey! you lose...'
  elModal.classList.remove('hidden')
  document.querySelector('.smiley-face').innerText = SMILEYDEAD
  for (var i = 0; i < gBoard.length; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = 0; j < gBoard[0].length; j++) {
      if (j < 0 || j >= gBoard[0].length) continue
      if (gBoard[i][j].isMine) gBoard[i][j].isRevealed = true
    }
  }
  renderBoard(gBoard)
}

function isVictory() {
  clearInterval(gIntervalId)
  gGame.isOn = false
  const elModal = document.querySelector('.modal')
  elModal.innerText = 'Congatulations!'
  elModal.classList.remove('hidden')
  document.querySelector('.smiley-face').innerText = SMILEYWIN
  //  localStorage.setItem('hiScore', score)
  //  localStorage.getItem('hiScore')
}

function expandReveal(board, elCell, idxI, idxJ) {
  //TODO: make it so cells clicked that have their .minesAroundCount = 0 also reveal other neighboring cells of the same attribute,
  //then stop at cells that have their .minesAroundCount > 0, and also not reveal any mines. 
  for (var i = idxI - 1; i <= idxI + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = idxJ - 1; j <= idxJ + 1; j++) {
      if (j < 0 || j >= board[0].length) continue
      if (i === idxI && j === idxJ) continue
      if (!board[i][j].isMine && !board[i][j].isRevealed && !board[i][j].isMarked) {
        board[i][j].isRevealed = true
        gGame.revealedCount++
      }
    }
  }
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


function randomizeMinesLocation(idxI, idxJ, board, amount) {
  for (var i = 0; i < amount; i++) {
    let cell = getRandomEmptyCell(idxI, idxJ)
    board[cell.i][cell.j].isMine = true
  }
}

