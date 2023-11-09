// canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let score = 0;
let clicks = 0;
let isPaused = false;
let gameFrame = 0;
ctx.font = '30px Calibri';

// mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

canvas.addEventListener('mousedown', function(event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    clicks += 1;
    if (mouse.x > player.x) {
        player.angle = Math.PI * 0.1;
    } else {
        player.angle = Math.PI * -0.1;
    }
})

canvas.addEventListener('mouseup', function() {
    mouse.click = false;
    player.angle = 0;
})

// background
class BackgroundLayer {
    constructor(image, speed) {
        this.width = 800;
        this.height = 1800
        this.x = 0;
        this.y = 600 - this.height;
        this.y2 = this.y - this.height;
        this.image = image;
        this.speed = speed;
    }
    update() {
        if (this.y >= canvas.height) {
            this.y = this.y2 - this.height;
        }
        if (this.y2 >= canvas.height) {
            this.y2 = this.y - this.height;
        }
        this.y = Math.floor(this.y + this.speed);
        this.y2 = Math.floor(this.y2 + this.speed);
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x, this.y2, this.width, this.height);
    }
}

const backgroundLayer1 = new Image();
backgroundLayer1.src = './assets/backgroundStars.png';
const layer1 = new BackgroundLayer(backgroundLayer1, 5);
const backgroundLayer2 = new Image();
backgroundLayer2.src = './assets/backgroundDust.png';
const layer2 = new BackgroundLayer(backgroundLayer2, 2);
const backgroundLayer3 = new Image();
backgroundLayer3.src = './assets/backgroundPlanet.png';
const layer3 = new BackgroundLayer(backgroundLayer3, 1);

const backgroundArray = [layer1, layer3, layer2];

// player
const playerShip = new Image();
playerShip.src = './assets/ship.png';

class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.life = 3;
        this.radius = 16;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 1;
        this.spriteWidth = 16;
        this.spriteHeight = 24;
    }
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

        // let theta = Math.atan2(dy, dx);                     Spaceship facing mouse click, didnt look right.
        // this.angle = theta - Math.PI * 0.5;
    

        if (mouse.x != this.x) {
            this.x -= dx / 15;
        }
        if (mouse.y != this.y) {
            this.y -= dy / 15;
        }
        
        if (gameFrame % 15 == 0) {
            if (gameFrame % 2 == 0) {
                if (this.frameY >= 1) {
                    this.frameY = 0;
                } else {
                    this.frameY++;
                }
            }
            if (this.frameX >= 4) {
                this.frameX = 0;
            } else {
                this.frameX++;
            }
        }
    }
    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = 'transparent';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle)
        ctx.drawImage(
            playerShip,                         // image
            this.frameX * this.spriteWidth,     // source X
            this.frameY * this.spriteHeight,    // source Y
            this.spriteWidth,                   // source width
            this.spriteHeight,                  // source height
            0 - this.spriteWidth,               // destination X
            0 - this.spriteWidth,               // destination Y
            this.spriteWidth * 2,               // destination width
            this.spriteHeight * 2               // destination height
        );
        ctx.restore();
    }
}
const player = new Player();

// asteroids
const asteroid = new Image();
asteroid.src = './assets/asteroid.png';

const asteroidArray = [];
class Asteroid {
    constructor() {
        this.randomSizeA = Math.floor(Math.random() * (25) + 2);    // random värde mellan 2 och 27
        this.randomSizeB = Math.floor(Math.random() * (25) + 2);    // random värde mellan 2 och 27
        this.radius = this.randomSizeA + this.randomSizeB;          // storleken på varje asteroid, mellan 4 och 54 px i radie
        this.x = Math.random() * canvas.width;
        this.y = -(this.radius * 2);
        this.angle = 0;
        this.rotation = Math.ceil(Math.random() * 10 - 5);
        this.speed = Math.random() * (-3) - 1;
        this.distance;
    }
    update() {
        this.y -= this.speed;
        this.x += this.speed + 2.5;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        this.angle += this.rotation / 200;
        
    }
    draw() {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();

        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle)
        ctx.drawImage(
            asteroid,                   // image
            0,                          // source X
            0,                          // source Y
            asteroid.width,             // source width
            asteroid.height,            // source height
            0 - this.radius * 1.3,      // destination X
            0 - this.radius * 1.3,      // destination Y
            (this.radius * 2) * 1.3,    // destination width
            (this.radius * 2) * 1.3     // destination height
        )
        ctx.restore();
    }
}

const asteroidCollision = document.createElement('audio');
asteroidCollision.src = './assets/asteroidExplosion.flac';

const shipCollision = document.createElement('audio');
shipCollision.src = './assets/shipExplosion.wav';
shipCollision.volume = '0.15';

const backgroundMusic = document.createElement('audio');
backgroundMusic.src = './assets/spaceship-shooter.ogg';
backgroundMusic.volume = '0.4';
backgroundMusic.loop = true;

function handleAsteroids() {
    let asteroidTimer = 20;
    if (score % 50 == 0) {
        asteroidTimer--;
    }
    if (gameFrame % asteroidTimer == 0) {
        asteroidArray.push(new Asteroid());
    }
    for (let i = 0; i < asteroidArray.length; i++) {
        asteroidArray[i].update();
        asteroidArray[i].draw();

        if (asteroidArray[i].distance < asteroidArray[i].radius + player.radius) {
            setTimeout(() =>{   // Fick blinkande asteroider, detta löste problement. Google någonstans levererade. Någonting med splice
                asteroidArray.splice(i, 1);
            })              
            shipCollision.currentTime = 0;
            shipCollision.play();
            player.life -= 1;
        }
        if (asteroidArray[i].y > canvas.height + asteroidArray[i].radius ) {
            setTimeout(() =>{   // Fick blinkande asteroider, detta löste problement. Google någonstans levererade. Någonting med splice
                asteroidArray.splice(i, 1);
            })    
            score += 1;
        }
    }
}

function checkGameState() {
    if (player.life > 0) {
        return;
    } else {
        isPaused = true;
        
        if (clicks != 0) {
            ctx.fillStyle = 'white';
            ctx.fillText('Score: ' + score, canvas.width / 2 - 200, canvas.height / 2 - 45);
            ctx.fillText('Clicks: ' + clicks, canvas.width / 2 - 200, canvas.height / 2);
            ctx.fillText('Score / Click: ' + Math.round(score / clicks * 1000) / 1000, canvas.width / 2 - 200, canvas.height / 2 + 45);
        }
    }
}
// animation loop
function animate() {
    checkGameState();
    if (isPaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backgroundArray.forEach(object => {
        object.update();
        object.draw();
    })
    handleAsteroids();
    player.update();
    player.draw();
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('Clicks: ' + clicks, 10, 60);
    ctx.fillText('Health: ' + player.life, 10, 90);
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();
backgroundMusic.play();

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})