var upPressed = false;
var downPressed = false;
var leftPressed = false
var rightPressed = false;
var lastPressed = false;
var bombSpeed = 1000;
var player = document.getElementById('player');
const startBtn = document.querySelector(".start")
const bombsDiv = document.querySelector(".bombs")
const explosionDiv = document.querySelector(".explo-div")
const health = document.querySelector(".health")
const gameOver = document.querySelector(".game-over")

let bombs = []
let start = false
let healthLeft = 3
let healthLoss = false

startBtn.addEventListener('click', () => {
    startBtn.className = "start hide"
	gameOver.className = "game-over"
	healthLeft = 3
	for(let i = 0; i < healthLeft; i++){
        const life = document.createElement("li")
		health.appendChild(life)
    }
	start = true 
	startGame()
    
})


function keyup(event) {
	var player = document.getElementById('player');
	if (event.keyCode == 37) {
		leftPressed = false;
		lastPressed = 'left';
	}
	if (event.keyCode == 39) {
		rightPressed = false;
		lastPressed = 'right';
	}
	if (event.keyCode == 38) {
		upPressed = false;
		lastPressed = 'up';
	}
	if (event.keyCode == 40) {
		downPressed = false;
		lastPressed = 'down';
	}

	player.className = 'character stand ' + lastPressed;
}


function move() {
	var positionLeft = player.offsetLeft;
	var positionTop = player.offsetTop;
	if (downPressed) {
		var newTop = positionTop+1;

		var element = document.elementFromPoint(player.offsetLeft, newTop+32);
		if (element.classList.contains('sky') == false) {
			player.style.top = newTop + 'px';	
		}

		if (leftPressed == false) {
			if (rightPressed == false) {
				player.className = 'character walk down';
			}
		}
	}
	if (upPressed) {
		var newTop = positionTop-1;

		var element = document.elementFromPoint(player.offsetLeft, newTop);
		if (element.classList.contains('sky') == false) {
			player.style.top = newTop + 'px';	
		}
		
		if (leftPressed == false) {
			if (rightPressed == false) {
				player.className = 'character walk up';
			}
		}
	}
	if (leftPressed) {
		var newLeft = positionLeft-1;

		var element = document.elementFromPoint(newLeft, player.offsetTop);
		if (element.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';	
		}


		player.className = 'character walk left';
	}
	if (rightPressed) {
		var newLeft = positionLeft+1;
		
		var element = document.elementFromPoint(newLeft+32, player.offsetTop);
		if (element.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';		
		}

		player.className = 'character walk right';
	}

}


function keydown(event) {
	if (event.keyCode == 37) {
		leftPressed = true;
	}
	if (event.keyCode == 39) {
		rightPressed = true;
	}
	if (event.keyCode == 38) {
		upPressed = true;
	}
	if (event.keyCode == 40) {
		downPressed = true;
	}
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
            if(distance < 50){
				healthLoss = true
                
            }
        }) 
    }else{
        return
    }
}

const checkExplosion = () => {
    if(start){
        bombs.forEach(bomb => {
            if(bomb.offsetTop === window.innerHeight - bomb.clientHeight){
				let explosionX = bomb.offsetLeft
				let explosionY = bomb.offsetTop
				const explosion = document.createElement("div")
				explosion.classList.add("explosion")
				explosionDiv.appendChild(explosion)
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

const updateHealth = () => {
    if(healthLoss){  

        healthLeft--
        if(healthLeft === 0 || healthLeft < 0){
			gameOver.className = "game-over show"
            health.innerHTML = ''
            start = false
            startBtn.className = "start show"
        } else {
            health.innerHTML = ''
            for(let i = 0; i < healthLeft; i++){
				const life = document.createElement("li")
				health.appendChild(life)
			}
        }
        healthLoss = false
    }
    
}

const startGame = () => {
    if(start){
        const bomb = document.createElement("div")
        bomb.classList.add("bomb")
        bombsDiv.appendChild(bomb)
        bomb.style.left = Math.floor(Math.random() * window.innerWidth) + "px"
        bomb.classList.add("fall")
        bombs.push(bomb)
        setTimeout(startGame,  1000)
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




function myLoadFunction() {
	const checkCollision = setInterval(collision, 100)
	const explosionInterval = setInterval(checkExplosion, 10)
	const removeExplosionMarks = setInterval(removeMarks, 2000)
	const healthCheck = setInterval(updateHealth, 10)
	timeout = setInterval(move, 10);
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
}


document.addEventListener('DOMContentLoaded', myLoadFunction);
