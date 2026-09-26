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

class inputBox extends box {
    constructor(x, y) {
        super(x, y)
        this.leadPower = true
    }
}

class lamp extends box {
    constructor(x, y) {
        super(x, y)
        this.leadPower = false
    }
}

class notGate extends gates {
    static array = [[1], [0]]
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
    static array = [[0], [1], [1], [1] ]
    constructor(x, y) {
        super(x, y)
        this.inBoxes.push(new box(x, y))
        this.inBoxes.push(new box(x+tileSize*2, y))
        this.outBoxes.push(new box(x+tileSize, y-tileSize))
        this.outBoxes[0].leadPower = true;
    }
}

class costumGate extends gates {
    constructor(x, y, inPorts, outPorts, logic, name) {
        super(x, y)
        for (let i = 0; i < inPorts; i++) {
            this.inBoxes.push(new box(x+i*2*tileSize, y))
        }
        for (let i = 0; i < outPorts; i++) {
            this.outBoxes.push(new box(x+i*2*tileSize, y-tileSize))
        }
        this.array = logic
        this.name = name

        for (let b = 0; b < this.outBoxes.length; b++) {
            this.outBoxes[b].leadPower = true
            if (this.array[0][b] == 1) {
                this.outBoxes[b].defaultPower = true
            }
        }
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

class spawner {
    constructor(x, y, name) {
        this.x = x
        this.y = y
        this.name = name
    }
}

class costumSpawner extends spawner {
    static nr = 0
    constructor(x, y, name, inPorts, outPorts, logic) {
        super(x, y, name)
        costumSpawner.nr += 1
        this.inPorts = inPorts
        this.outPorts = outPorts
        this.array = logic
        this.number = costumSpawner.nr

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
        for (let i of inputBoxes) {
            updatePower(i, simulation)
        }

        for (let n of notGates) {
            updatePower(n.inBoxes[0], simulation)
            console.log(notGate.array)
            let a = analyseOutPut(createInputArray(n), notGate.array)
                if(a[0] == 1) {
                    n.outBoxes[0].hasPower = true
                } else {
                    n.outBoxes[0].hasPower = false
                }
        }

        for(let o of orGates) {
            updatePower(o.inBoxes[0], simulation)
            updatePower(o.inBoxes[1], simulation)
            let a = analyseOutPut(createInputArray(o), orGate.array)
            if(a[0] == 1) {
                o.outBoxes[0].hasPower = true
            }
            else {
                o.outBoxes[0].hasPower = false
            }
        }
    
        for(let c of costumGates) {
            for (let b of c.inBoxes) {
                updatePower(b, simulation)
            }
            let a = analyseOutPut(createInputArray(c), c.array)
            for (let i = 0; i < c.outBoxes.length; i++) {
                if(a[i] == 1) {
                    c.outBoxes[i].hasPower = true
                }
                else {
                    c.outBoxes[i].hasPower = false
                }
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

function createInputArray(gate) {
    let array = []
    for(let inbox of gate.inBoxes) {
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
     spawers.push(new costumSpawner((spawers.length+1)*100, 200, "costum", selectedInputs.length, selectedOutputs.length, outputs))
     for (b of selectedInputs) {
        b.defaultPower = false
    }
    selectedInputs = []
    selectedOutputs = []
    draw();
    return outputs;
}

let spawers = []

spawers.push(new spawner(100, 200, "onBox"))
spawers.push(new spawner(200, 200, "input"))
spawers.push(new spawner(300, 200, "lamp"))
spawers.push(new spawner(400, 200, "notGate"))
spawers.push(new spawner(500, 200, "orGate"))


let currentbox = {
    x: 0,
    y: 0
}


let onBoxes = []
let lamps = []
let boxes = []
let inputBoxes = []
let wires = []
let notGates = []
let orGates = []
let selectedInputs = []
let selectedOutputs = []
let costumGates = []
draw();


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red"
    for (s of spawers) {
        ctx.fillRect(s.x, s.y, tileSize, tileSize);
    }

    ctx.fillStyle = "green"
    ctx.fillRect(currentbox.x, currentbox.y, tileSize, tileSize);



    for (let b of onBoxes) {
        ctx.fillStyle = "pink";
        ctx.fillRect(b.x, b.y, tileSize, tileSize);
    }
    for (let i of inputBoxes) {
        ctx.fillStyle = "green";
        ctx.fillRect(i.x, i.y, tileSize, tileSize);
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

    for (let c of costumGates) {
        ctx.fillStyle = "blue";
        for(b of c.inBoxes) {
            ctx.fillRect(b.x, b.y, tileSize, tileSize);
        }
        ctx.fillStyle = "red";
        for(b of c.outBoxes) {
            ctx.fillRect(b.x, b.y, tileSize, tileSize);
        }
    }

}

let isDragging = false;
let draggingItem = ''
let firstSelectedBox = null;
let secondSelectedBox = null;


function checkIfClicked(boxX, boxY, e, leftClick) {
    if (e.offsetX > boxX && e.offsetX < boxX+tileSize &&
        e.offsetY > boxY && e.offsetY < boxY+tileSize) {
            if (e.button === 0 && leftClick) {
                console.log("leftClick")
                return true
            } else if (e.button === 2 && !leftClick) {
                console.log("RIGHTT")
                return true
            } else {
                return false
            }
        }
}

function checkAnyBlockClicked(e, leftClick) {
    for(let b of boxes) {
        if(checkIfClicked(b.x, b.y, e, leftClick)) {
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

let deleteBox;

document.addEventListener('mousedown', (e) => {
    mouseX = e.offsetX
    mouseY = e.offsetY
    console.log(e.button)
    if (editMode) { 
        let selectedBox = checkAnyBlockClicked(e, true)
        if (selectedBox !== null) {
            if (!selectedBox.leadPower || selectedBox instanceof inputBox) {
                selectedInputs.push(selectedBox)
                console.log("ggs")
            }
            else {
                selectedOutputs.push(selectedBox)
            }
        }
    } else {
        //OnBox 
        for (s of spawers) {
            if(checkIfClicked(s.x, s.y, e, true)) {
                isDragging = true
                draggingItem = s
                draw()
            }
        }

        firstSelectedBox = checkAnyBlockClicked(e, true);
        console.log(firstSelectedBox)
        if (firstSelectedBox !== null) {
            isDragging = true;
            draggingItem = 'w';
            draw();
        }
        deleteBox = checkAnyBlockClicked(e, false)
        if (deleteBox !== null) {
            if (deleteBox instanceof onBox) {
                for(let b of deleteBox.connectedBoxes) {
                    if (b.connectedBoxes === deleteBox) {
                        //emm venter med mer kode 

                    }
                }
                onBoxes = onBoxes.filter(obj => obj !== deleteBox);
                console.log("clear")
            }
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
        if (draggingItem === 'w') {
              secondSelectedBox = checkAnyBlockClicked(e, true);
                if(secondSelectedBox !== null && secondSelectedBox !== firstSelectedBox) {
                    wires.push(new wire(firstSelectedBox, secondSelectedBox))
                    console.log("WIREE")
                    console.log(wires)
                    console.log(firstSelectedBox)
                    console.log(secondSelectedBox)
                }
        } else {
        switch (draggingItem.name) {
            case "onBox":
                onBoxes.push(new onBox(mouseX, mouseY));
                break;
            case "input":
                inputBoxes.push(new inputBox(mouseX, mouseY))
                break;
            case 'lamp':
                lamps.push(new lamp(mouseX, mouseY));
                break;
            case 'notGate':
                notGates.push(new notGate(mouseX, mouseY))
                break;

            case 'orGate':
                orGates.push(new orGate(mouseX, mouseY))
                break;
            
            case "costum":
                let spawn = draggingItem
                console.log(spawn)
                costumGates.push(new costumGate(mouseX, mouseY, spawn.inPorts, spawn.outPorts, spawn.array, spawn.name))
            }
        }
        draw()
            
    }
});
