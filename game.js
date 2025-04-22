const titleElement = document.getElementById('title')
const timerElement = document.getElementById('timer')
const counterElement = document.getElementById('counter')
const scoreElement = document.getElementById('score')
const footerElement = document.getElementById('footer')

const countdownSetSound = new Audio('sounds/countdown-set.wav')
const countdownGoSound = new Audio('sounds/countdown-go.wav')
const pointSound = new Audio('sounds/point.wav')

let clicks = 0

function enableStart() {
    document.addEventListener('contextmenu', start)
}

function disableStart() {
    document.removeEventListener('contextmenu', start)
}

async function start() {
    disableStart()

    clicks = 0
    counterElement.textContent = 0

    titleElement.hidden = true
    footerElement.hidden = true
    timerElement.hidden = false
    counterElement.hidden = false

    await countdown(4, (second) => {
        if (second > 1) {
            reproduceSound(countdownSetSound)
            timerElement.textContent = second - 1
        } else if (second > 0) {
            reproduceSound(countdownGoSound)
            timerElement.textContent = 'GO!'
        }
    })

    document.addEventListener('click', recordClick)

    await countdown(10, (second) => {
        timerElement.textContent = second
    })

    stop()
}

function stop() {
    document.removeEventListener('click', recordClick)

    titleElement.hidden = false
    footerElement.hidden = false
    timerElement.hidden = true

    registerScore(clicks / 10)
    enableStart()
}

function recordClick() {
    clicks += 1
    counterElement.textContent = clicks
    reproduceSound(pointSound)
}

function registerScore(cps) {
    const score = localStorage.getItem('score') ?? 0
    if (cps > score) {
        localStorage.setItem('score', cps)
        showScore()
    }
}

function showScore() {
    const score = localStorage.getItem('score') ?? 0
    scoreElement.textContent = `${score} CPS`
}

function countdown(seconds, callback) {
    return new Promise((resolve) => {
        callback(seconds--)
        const intervalId = setInterval(() => {
            callback(seconds--)
            if (seconds < 0) {
                clearInterval(intervalId)
                resolve()
            }
        }, 1000)
    })
}

function reproduceSound(sound) {
    sound.currentTime = 0
    sound.play()
}

// On Load

document.addEventListener('contextmenu', (e) => e.preventDefault())
showScore()
enableStart()
