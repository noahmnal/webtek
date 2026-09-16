// Task 1
function task1_myName() {
    let name = "Noah";
    return name
}

// Task 2
function task2_sumOfTwoNumbers() {
    const a = 10;
    const b = 20;
    return a+b;
}

// Task 3
function task3_arrayOfCities() {
    const list = ["Trondheim", "Bergen", "Oslo"];
    return list;
}

// Task 4
function task4_secondCity() {
    return task3_arrayOfCities[1]
}

// Task 5
function task5_sumOfNumbers() {
    const numbers = [1,2,3,4,5];
    let sum = 0;
    for(let i of numbers) {
        sum += i
    }
    return sum
}

// Task 6
function task6_positiveOrNegative(number) {
    if (number >= 0) {
        return number + " er et positivt tall"
    }
    return number + " er et negativt tall"
}

// Task 7
function task7_personObject() {
    const person = {
        firstName: "Ola",
        lastName: "Nordmann",
        age: 50,
        getFullName() {return this.firstName + " " + this.lastName} 
    }
        return person.getFullName() + " er " + person.age + " år."
}

function task8_carrotcake(number) {
    let string = ""
    if (number % 3 == 0) {
        string = "carrot"
    }

    if (number % 5 == 0) {
        string += "cake"
    }
    return string;
 }

 function task9_daysBetween(startDate, endDate, includeEndDate) {
    
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        throw new TypeError("Pls bruk Date objekter!! <3")
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    if (includeEndDate) {
        return (endDate - startDate) / msPerDay + 1;
    } else {
        return (endDate - startDate) / msPerDay;
    }
 }


// Code for task 8 and 9 here ...

// DO NOT EDIT OR DELETE THIS FUNCTION
function printSolution() {
    document.querySelector("#task1").innerHTML = task1_myName();
    document.querySelector("#task2").innerHTML = task2_sumOfTwoNumbers();
    document.querySelector("#task3").innerHTML = task3_arrayOfCities();
    document.querySelector("#task4").innerHTML = task4_secondCity();
    document.querySelector("#task5").innerHTML = task5_sumOfNumbers();
    document.querySelector("#task6").innerHTML = task6_positiveOrNegative(1) + ", " + task6_positiveOrNegative(-1);
    document.querySelector("#task7").innerHTML = task7_personObject();
    document.querySelector("#task8").innerHTML = task8_carrotcake(3) + ", " + task8_carrotcake(5) + ", " + task8_carrotcake(15);
    document.querySelector("#task9").innerHTML = task9_daysBetween(new Date("2020/02/28"), new Date("2020/03/01"), true);
}

