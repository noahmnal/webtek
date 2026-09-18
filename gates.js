const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const tileSize = 30;


ctx.fillStyle = "green"

let mouseX = 0
let mouseY = 0

class box {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        boxes.push(this)
    }
}

class onBox extends box {
    constructor(x, y) {
        super(x, y)
    }
    
}

class lamp  extends box {
    constructor(x, y) {
        super(x, y)
    }
}

class wire {
    constructor(fromBox, toBox) {
        this.fromBox = fromBox;
        this.toBox = toBox;
    }
}

let onBoxSpawner = {
    x: 200, 
    y: 200
}

let lampSpawner = {
    x: 300, 
    y: 200
}

let currentbox = {
    x: 0,
    y: 0
}

let onBoxes = []
let lamps = []
let boxes = []
draw();


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red"
    //onBox
    ctx.fillRect(onBoxSpawner.x, onBoxSpawner.y, tileSize, tileSize);

    //light
    ctx.fillRect(lampSpawner.x, lampSpawner.y, tileSize, tileSize);

    ctx.fillStyle = "green"
    ctx.fillRect(currentbox.x, currentbox.y, tileSize, tileSize);

    for (b of onBoxes) {
        ctx.fillStyle = "pink";
        ctx.fillRect(b.x, b.y, tileSize, tileSize);
    }

    for (b of lamps) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(b.x, b.y, tileSize, tileSize);
    }
}

let isDragging = false;
let draggingItem = ''


function checkIfClicked(boxX, boxY, e) {
    return (e.button === 0 && e.offsetX > boxX && e.offsetX < boxX+tileSize &&
        e.offsetY > boxY && e.offsetY < boxY+tileSize)
    }



document.addEventListener('mousedown', (e) => {
    mouseX = e.offsetX
    mouseY = e.offsetY

    //OnBox 
    if(checkIfClicked(onBoxSpawner.x, onBoxSpawner.y, e)) {
        console.log("trykk")
        isDragging = true
        draggingItem = 'O'
        draw()
    }

    //Lamp
    if(checkIfClicked(lampSpawner.x, lampSpawner.y, e)) {
        isDragging = true
        draggingItem = 'L'
        draw()
    }

    //Wire from onBoxes
    for(box of boxes) {
        if(checkIfClicked(box.x, box.y, e)) {
            isDragging = true;
            draggingItem = 'W'
            draw;
        }
    }



});


    document.addEventListener('mousemove', (e) => {
        if(isDragging) {
            mouseX = e.offsetX
            mouseY = e.offsetY
            currentbox.x = mouseX
            currentbox.y = mouseY
            draw()
        }

});

document.addEventListener('mouseup', (e) => {
    if(e.button === 0 && isDragging === true) {
        isDragging = false
        console.log(draggingItem);
        switch (draggingItem) {

            case 'O':
                onBoxes.push(new onBox(mouseX, mouseY));
                break;
            case 'L':
                lamps.push(new lamp(mouseX, mouseY));
                break;
        }
            
    }
});
