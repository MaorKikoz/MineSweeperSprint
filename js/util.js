'use strict'

function createMat(size) {
    const mat = []
    for (var i = 0; i < size; i++) {
        const row = []
        for (var j = 0; j < size; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function startTimer() {
  const elTimer = document.querySelector('.timer')
  const startTime = Date.now()

  gIntervalId = setInterval(() => {
    const timeDiff = Date.now() - startTime
    const totalTime = getPassedTimeF(timeDiff)
    elTimer.innerText = totalTime
  }, 10)
}


function getPassedTimeF(timeDiff) {
    const seconds = Math.floor(timeDiff / 1000)
    const milliSec = (timeDiff - seconds * 1000 + '').padStart(3, '0')
    return `${(seconds + '').padStart(2, '0')} : ${milliSec}`
}

function getEmptyCells(idxI, idxJ) {
    const emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (idxI === i && idxJ === j) continue
            if (!gBoard[i][j].isMine) {
                emptyCells.push({ i, j })
            }
        }
    }
    return emptyCells
}

function getRandomEmptyCell(idxI, idxJ) {
    const emptyCells = getEmptyCells(idxI, idxJ)
    if (emptyCells.length === 0) return null

    var randomIdx = getRandomInt(0, emptyCells.length - 1)
    return emptyCells[randomIdx]
}