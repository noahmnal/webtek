//Bare for lek


console.log('hello world');
let i = 1/3;
const pi = 3.14;
let sum = i + pi;
console.log(sum);
let list = [10, 20, 30, 40, 50]
for(let item of list) {
    console.log(item);
}

for(let i = 0; i < 10; i++) {
    console.log(i);
}
console.log("ferdig")

if (list.includes(10)) {
    console.log("JAJJAJAJA") }

class person {
    constructor(navn, alder) {
        this.navn = navn
        this.alder = alder
    }
    hello() {
        console.log('Jeg heter ' + this.navn + ' og er ' + this.alder + ' år')
    }
}

let p = new person("noah", 20);
p.hello();