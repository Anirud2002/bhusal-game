const canvas = document.querySelector(".canvas")
const player = document.querySelector(".player")
const playerImg = document.querySelector(".player img")
const START = document.querySelector(".start")
const startBtn = document.querySelector(".start-btn")
const saveBtn = document.querySelector(".save-btn")
const health = document.querySelector(".health")
const gameOver = document.querySelector(".game-over")
const nameInput = document.querySelector(".name-input")
const playerName = document.querySelector(".player-name")
let playerSpeed = 10
let start = false
let bombs = []
let bombSrc = ["./imgs/bomb1.png", "./imgs/bomb2.png"]
let bombCreationTime = [1, 2, 3, 4]
let healthLeft = 3
let healthLoss = false

saveBtn.addEventListener("click", (e) => {
    e.preventDefault()
    playerName.textContent = nameInput.value
    nameInput.value = ""
})




const updateHealth = () => {
    if(healthLoss){         
        healthLeft--
        if(healthLeft === 0 || healthLeft < 0){
            playerImg.src = "./imgs/dead-side.png"
            health.innerHTML = ''
            start = false
            gameOver.className = "game-over appear"
            START.className = "start show"
        } else {
            player.className = "player dead-animation"
            setTimeout(() => {
                player.className = "player"
            }, 1000)
            health.innerHTML = ''
            for(let i = 0; i < healthLeft; i++){
                const life = document.createElement("div")
                life.classList.add("life")
                health.appendChild(life)
                life.innerHTML = '<i class="fas fa-heart"></i>'
            }
        }
        healthLoss = false
    }
    
}

startBtn.addEventListener('click', () => {
    START.className = "start hide"
    gameOver.className = "game-over"
    playerImg.src = "./imgs/middle-side.png"
    healthLeft = 3
    for(let i = 0; i < healthLeft; i++){
        const life = document.createElement("div")
        life.classList.add("life")
        health.appendChild(life)
        life.innerHTML = '<i class="fas fa-heart"></i>'
    }
    start = true
    startGame()
    
})

document.addEventListener("keydown", (e) => {
    if(start){
        if(e.keyCode===37){
            moveLeft()
        }
        if(e.keyCode===39){
            moveRight()
        }
    }
    else{
            return
        }

})

document.addEventListener("keyup", (e) => {
    if(e.keyCode===37 || e.keyCode === 39){
        playerImg.src="./imgs/middle-side.png"
    }
})

const moveLeft = () => {
    playerImg.src="./imgs/left-side.png"
    let posX = player.offsetLeft
    posX = posX - playerSpeed
    if(posX < player.clientWidth || posX < 0){
        posX = player.clientWidth/2
        player.style.left = posX + "px"
        return
    }
    player.style.left = posX + "px"
}

const moveRight = () => {
    playerImg.src="./imgs/right-side.png"
    let posX = player.offsetLeft
    posX = posX + playerSpeed
    if(posX > window.innerWidth - player.clientWidth / 2){
        posX = window.innerWidth - player.clientWidth / 2
        player.style.left = posX + "px"
        return
    }
    player.style.left = posX + "px"
}

const checkExplosion = () => {
    if(start){
        bombs.forEach(bomb => {
            if(bomb.offsetTop === window.innerHeight - bomb.clientHeight){
                let explosionX = bomb.offsetLeft
                let explosionY = bomb.offsetTop
                const explosion = document.createElement("div")
                explosion.classList.add("explosion")
                const explosionImg = document.createElement("img")
                explosionImg.src = "./imgs/bomb-explosion.png"
                explosion.appendChild(explosionImg)
                canvas.appendChild(explosion)
                bomb.remove()
                explosion.style.left = explosionX - 25 + "px"
                explosion.style.top = explosionY - 20 + "px"
                let explosionSound = new Audio("./explosion.wav")
                explosionSound.play()
                
    
            }
        })
    }else{
        return
    }
}

const removeMarks = () => {
    const marks = document.querySelectorAll('.explosion')
    marks.forEach(mark => {
        mark.remove()
    })
}



const collision = () => {
    if(start){
        let playerX = player.offsetLeft
        let playerY = player.offsetTop
        bombs.forEach(bomb => {
            let bombX = bomb.offsetLeft
            let bombY = bomb.offsetTop
            let xDiff = bombX - playerX
            let yDiff = bombY - playerY
            let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
            if(distance < 70){
                healthLoss = true
                
            }
        }) 
    }else{
        return
    }
}


const startGame = () => {
    if(start){
        const bomb = document.createElement("div")
        bomb.classList.add("bomb")
        const bombImg = document.createElement('img')
        bombImg.src = bombSrc[0]
        bomb.appendChild(bombImg)
        canvas.appendChild(bomb)
        bomb.style.left = Math.floor(Math.random() * window.innerWidth) + "px"
        bomb.classList.add("fall")
        bombs.push(bomb)
        let randomSec = Math.floor(Math.random() * bombCreationTime.length) + 1 * 1000
        setTimeout(startGame,  randomSec)
    }
    else{
        console.log(start)
        bombs = []
        document.querySelectorAll(".bomb").forEach(bomb => {
            bomb.remove()
        })
        return
    }
    
}

const explosionInterval = setInterval(checkExplosion, 10)
const removeExplosionMarks = setInterval(removeMarks, 2000)
const checkCollision = setInterval(collision, 100)
const healthCheck = setInterval(updateHealth, 10)