const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');



let tileSize = 10
let head = {
    xpos: 100,
    ypos: 100
}

class body {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

let snakeBody = [new body(head.xpos-tileSize, head.ypos-tileSize)]

let dir = {x: 0, y: 0}


let apple = {
    x: 200,
    y: 200
}


document.addEventListener('keydown', (event) => {
    if (event.key == 'w' && dir.y != 1) {
        dir = {x: 0, y: -1}
    }
    else if (event.key == 'a' && dir.x != 1) {
        dir = {x: -1, y: 0}
    }
    else if (event.key == 's' && dir.y != -1) {
        dir = {x: 0, y: 1}
    }
    else if (event.key == 'd' && dir.x != -1) {
        dir = {x: 1, y: 0}
    }

});

// Returns boolean
function appleEaten() {
    return (apple.x == head.xpos && apple.y == head.ypos)
}


setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red"
    ctx.fillRect(apple.x, apple.y, tileSize, tileSize)
    

    ctx.fillStyle = "green"
    for (tile of snakeBody) {
            ctx.fillRect(tile.x, tile.y, tileSize, tileSize)
        }
    if(!appleEaten()) {
        snakeBody.pop();
    }
    snakeBody.unshift(new body(head.xpos, head.ypos));

    ctx.fillRect(head.xpos, head.ypos, tileSize, tileSize); 
    head.xpos += dir.x*tileSize;
    head.ypos += dir.y*tileSize;
    console.log(snakeBody)
}, 100);