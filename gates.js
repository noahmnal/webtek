const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const tileSize = 30;


ctx.fillStyle = "green"
ctx.strokeStyle = "red";
ctx.lineWidth = 2;

let mouseX = 0
let mouseY = 0

class box {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.leadPower = false
        boxes.push(this)
    }
}

class onBox extends box {
    constructor(x, y) {
        super(x, y)
        this.leadPower = true
    }
    
}

class lamp extends box {
    constructor(x, y) {
        super(x, y)
        this.leadPower = false
        this.isGlowing = false
    }

    setIsGlowing(boolean) {
        this.isGlowing = boolean;
    }

}

class wire {
    constructor(fromBox, toBox) {
        this.fromBox = fromBox;
        this.toBox = toBox;
        if (fromBox.leadPower || toBox.leadPower) {
        this.leadPower = true
        }
        if(this.leadPower && (fromBox instanceof lamp)) {
            fromBox.setIsGlowing(true)
        }
        if(this.leadPower && (toBox instanceof lamp)) {
            toBox.setIsGlowing(true)
        }
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
let wires = []
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

    for (l of lamps) {
        if (l.isGlowing) {
        ctx.fillStyle = "yellow";
        } else {
            ctx.fillStyle = "black"
        }
        ctx.fillRect(l.x, l.y, tileSize, tileSize);
    }

    for (w of wires) {
        
        ctx.beginPath();
        ctx.moveTo(w.fromBox.x, w.fromBox.y);   // startpunkt
        ctx.lineTo(w.toBox.x, w.toBox.y);   // endepunkt
        ctx.stroke();
    }
}

let isDragging = false;
let draggingItem = ''
let firstSelectedBox = null;
let secondSelectedBox = null;


function checkIfClicked(boxX, boxY, e) {
    return (e.button === 0 && e.offsetX > boxX && e.offsetX < boxX+tileSize &&
        e.offsetY > boxY && e.offsetY < boxY+tileSize)
}

function checkAnyBlockClicked(e) {
    for(box of boxes) {
        if(checkIfClicked(box.x, box.y, e)) {
            return box;
        }
    }
    return null;
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

    firstSelectedBox = checkAnyBlockClicked(e);
    console.log(firstSelectedBox)
    if (firstSelectedBox !== null) {
        isDragging = true;
        draggingItem = 'W'
        draw;
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
    console.log(isDragging)
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
            case 'W':
                secondSelectedBox = checkAnyBlockClicked(e);
                if(secondSelectedBox !== null) {
                    wires.push(new wire(firstSelectedBox, secondSelectedBox))
                    console.log("WIREE")
                
                }
                break;
        }
        draw()
            
    }
});
