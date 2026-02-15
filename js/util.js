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

function getPassedTimeF(timeDiff) {
     const seconds = Math.floor(timeDiff / 1000)
     const milliSec = (timeDiff - seconds * 1000 + '').padStart(3, '0')
     return `${(seconds + '').padStart(2, '0')} : ${milliSec}`
}

