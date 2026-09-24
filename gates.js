const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const tileSize = 30;


ctx.fillStyle = "green"
ctx.strokeStyle = "red";
ctx.lineWidth = 2;

let mouseX = 0
let mouseY = 0

let editMode = false


class box {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.leadPower = false
        this.basePower = false
        this.defaultPower = false
        this.hasPower = this.defaultPower
        boxes.push(this)
        this.connectedBoxes = []
    }
}

class gates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.inBoxes = []
        this.outBoxes = []
    }
}

class onBox extends box {
    constructor(x, y) {
        super(x, y)
        this.leadPower = true
        //defaultPower is changeble in simulation
        this.defaultPower = true
        //basePower is a constant.
        this.basePower = true
    }
    
}

class lamp extends box {
    constructor(x, y) {
        super(x, y)
        this.leadPower = false
    }
}

class notGate extends gates {
    constructor(x, y) {
        super(x, y)
        this.inBoxes.push(new box(x, y))
        this.outBoxes.push(new box(x, y-tileSize))      
        this.outBoxes[0].leadPower = true
        this.outBoxes[0].basePower = true
        this.outBoxes[0].defaultPower = true
    }
}

class orGate extends gates {
    constructor(x, y) {
        super(x, y)
        this.inBoxes.push(new box(x, y))
        this.inBoxes.push(new box(x+tileSize*2, y))
        this.outBoxes.push(new box(x+tileSize, y-tileSize))
        this.outBoxes[0].leadPower = true;
    }
}
 
class wire {
    constructor(fromBox, toBox) {
        if(!fromBox instanceof box || !toBox instanceof box) {
            throw TypeError("Wire coocked");
        }
        this.fromBox = fromBox;
        this.toBox = toBox;
        fromBox.connectedBoxes.push(toBox);
        toBox.connectedBoxes.push(fromBox);
    }
}

function updatePower(l, simulation) {
    if(!l instanceof box) {
        throw TypeError("box not boxing");
    }
    for(let c of l.connectedBoxes) {
        if(c.leadPower && c.hasPower) {
            l.hasPower = true
            return;
        }
    }
    if (l.defaultPower !== true) {
        l.hasPower = false
    }
}


////function updateWirePower(w) {
  //      if((w.fromBox.hasPower && w.fromBox.leadPower) || w.toBox.hasPower && w.toBox.leadPower) {
         //   console.log("StRØm")
           // w.fromBox.hasPower = true
       //     w.toBox.hasPower = true
     //   }

   // }

function updateAllPower(simulation) {

    for (let b of boxes) {
        b.hasPower = b.defaultPower;
    }

    for(let i = 0; i < 3; i++) {

        for (let o of onBoxes) {
            updatePower(o, simulation)
        }

        for (let n of notGates) {
            updatePower(n.inBoxes[0], simulation)
            let a = analyseOutPut(createInputArray(n), notArray)
                if(a[0] == 1) {
                    n.outBoxes[0].hasPower = true
                } else {
                    n.outBoxes[0].hasPower = false
                }
        }

        for(let o of orGates) {
            updatePower(o.inBoxes[0], simulation)
            updatePower(o.inBoxes[1], simulation)
            let a = analyseOutPut(createInputArray(o), orArray)
            if(a[0] == 1) {
                o.outBoxes[0].hasPower = true
            }
            else {
                o.outBoxes[0].hasPower = false
            }
        }

        for (let w of wires) {
                console.log(w)
                //updateWirePower(w);
            }

        for(let l of lamps) {
            updatePower(l, simulation)
        }
}
    draw()
}

//Array skrivemåte er binary

let notArray = [[1], [0]]
let orArray =[[0], [1], [1], [1] ]

function createInputArray(box) {
    let array = []
    for(let inbox of box.inBoxes) {
        if(inbox.hasPower) {
        array.push(1)
        } else {
            array.push(0)
        }  
    }
    
    return array
}


function analyseOutPut(input, array) {
    let binary = input.join("")
    let i = parseInt(binary, 2)
    return array[i]
}

function simulateRun() {
    let outputs = []
    let str = ""
    for (let outer = 0; outer < 2**selectedInputs.length; outer++) {
        let bin = outer.toString(2).padStart(selectedInputs.length, "0");
        console.log("binary" + bin)
        for(let i = 0; i < selectedInputs.length; i++) {
            if (bin[i] == "1") {
            selectedInputs[i].defaultPower = true
            console.log("haspower true")
            } else {
            console.log("haspower false")
            selectedInputs[i].defaultPower = false
            console.log(selectedInputs[i].hasPower)
            }
        }
        for (let x of selectedInputs) {
            console.log(x.hasPower)
        }
        console.log("INPUT")
        console.log(selectedInputs[0].hasPower)
        updateAllPower(true)
        console.log("OUTPUT")
        console.log(selectedOutputs[0].hasPower)
        for(let o = 0; o < selectedOutputs.length; o++) {
            if (selectedOutputs[o].hasPower) {
                str += "1"
            } else {
                str += "0"
            }
        }
        console.log(selectedInputs)
        console.log(selectedOutputs)
        outputs.push(str) 
        str = ""
    }
     for (b of selectedInputs) {
        b.defaultPower = false
    }
    selectedInputs = []
    selectedOutputs = []
    return outputs;
}

let onBoxSpawner = {
    x: 200, 
    y: 200
}

let lampSpawner = {
    x: 300, 
    y: 200
}

let notGateSpawner = {
    x: 400, 
    y: 200
}

let orGateSpawner = {
    x: 500, 
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
let notGates = []
let orGates = []
let selectedInputs = []
let selectedOutputs = []
draw();


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red"
    //onBox
    ctx.fillRect(onBoxSpawner.x, onBoxSpawner.y, tileSize, tileSize);

    //light
    ctx.fillRect(lampSpawner.x, lampSpawner.y, tileSize, tileSize);

    //notGates
     ctx.fillRect(notGateSpawner.x, notGateSpawner.y, tileSize, tileSize);

     //orGates
     ctx.fillRect(orGateSpawner.x, orGateSpawner.y, tileSize, tileSize);


    ctx.fillStyle = "green"
    ctx.fillRect(currentbox.x, currentbox.y, tileSize, tileSize);



    for (let b of onBoxes) {
        ctx.fillStyle = "pink";
        ctx.fillRect(b.x, b.y, tileSize, tileSize);
    }

    for (let l of lamps) {
        if (l.hasPower) {
        ctx.fillStyle = "yellow";
        } else {
            ctx.fillStyle = "black"
        }
        ctx.fillRect(l.x, l.y, tileSize, tileSize);
    }

    for (let w of wires) {
        ctx.beginPath();
        ctx.moveTo(w.fromBox.x, w.fromBox.y);  
        ctx.lineTo(w.toBox.x, w.toBox.y);  
        ctx.stroke();
    }

    for (let n of notGates) {
        ctx.fillStyle = "blue";
        ctx.fillRect(n.inBoxes[0].x, n.inBoxes[0].y, tileSize, tileSize);
        ctx.fillStyle = "red";
        ctx.fillRect(n.outBoxes[0].x, n.outBoxes[0].y, tileSize, tileSize);
    }

    for (let o of orGates) {
        ctx.fillStyle = "blue";
        ctx.fillRect(o.inBoxes[0].x, o.inBoxes[0].y, tileSize, tileSize);
        ctx.fillRect(o.inBoxes[1].x, o.inBoxes[1].y, tileSize, tileSize);
        ctx.fillStyle = "red";
        ctx.fillRect(o.outBoxes[0].x, o.outBoxes[0].y, tileSize, tileSize);

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
    for(let b of boxes) {
        if(checkIfClicked(b.x, b.y, e)) {
            return b;
        }
    }
    return null;
}

document.addEventListener('keydown', (e) => {
    updateAllPower(false);

    if (e.key === "e") {
        console.log("Edit mode = " + editMode)
        if(editMode) {
            console.log(selectedInputs)
            console.log(selectedOutputs)
            console.log("dette er simulationen" + simulateRun())
        } else {
        }
        editMode = !editMode
    }
});

document.addEventListener('mousedown', (e) => {
    mouseX = e.offsetX
    mouseY = e.offsetY
    if (editMode) { 
        let selectedBox = checkAnyBlockClicked(e)
        if (selectedBox !== null) {
            if (selectedBox.leadPower) {
                selectedOutputs.push(selectedBox)
            }
            else {
                selectedInputs.push(selectedBox)
            }
        }
    } else {
        //OnBox 
        if(checkIfClicked(onBoxSpawner.x, onBoxSpawner.y, e)) {
            isDragging = true
            draggingItem = 'B'
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
            draw();
        }

        if(checkIfClicked(notGateSpawner.x, notGateSpawner.y, e)) {
            isDragging = true;
            draggingItem = 'N';
            draw();
        }

        if(checkIfClicked(orGateSpawner.x, orGateSpawner.y, e)) {
            isDragging = true;
            draggingItem = 'O';
            draw();
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
    console.log(isDragging)
    if(e.button === 0 && isDragging === true) {

        isDragging = false
        console.log(draggingItem);
        switch (draggingItem) {
            case 'B':
                onBoxes.push(new onBox(mouseX, mouseY));
                break;
            case 'L':
                lamps.push(new lamp(mouseX, mouseY));
                break;
            case 'N':
                notGates.push(new notGate(mouseX, mouseY))
                break;

            case 'O':
                orGates.push(new orGate(mouseX, mouseY))
                break;
            
            case 'W':
                secondSelectedBox = checkAnyBlockClicked(e);
                if(secondSelectedBox !== null && secondSelectedBox !== firstSelectedBox) {
                    wires.push(new wire(firstSelectedBox, secondSelectedBox))
                    console.log("WIREE")
                    console.log(wires)
                    console.log(firstSelectedBox)
                    console.log(secondSelectedBox)
                
                }
                break;
        }
        draw()
            
    }
});
