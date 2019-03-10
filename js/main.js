window.onload = draw();
function draw() {
	var container = document.getElementById("game");
	for(let i = 0; i < 16; i++) {
		var div = document.createElement("div");
		div.className = "boxes";
		container.appendChild(div);
	}
}

function insertNumbers(number, value) {
    boxes[number].textContent = value;
}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function returnMax(value1, value2) {
    return value1 > value2 ? value1 :  value2;
}

function returnMin(value1, value2) {
    return value1 > value2 ? value2 : value1;
}

function countEven(value) {
    usedNumbers.forEach((usedNumber) => {
        if (usedNumber < value) evenness++;
    });
}

function clearBoxes() {
    boxes.forEach((item) => {
        item.classList.remove('reserved');
        item.textContent = '';
    })
}

function defineNumbers() {
    clearBoxes();
    usedNumbers = [];
    reserved = randomInteger(0, 15);
    evenness = reserved < 4 ? 1 : (reserved < 8 && reserved >= 4) ? 2 : (reserved < 12 && reserved >=8) ? 3 : 4; 
    console.log(evenness);
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    timeCounter.style.display = 'none';
    document.body.style.background = '';
    boxes[reserved].classList.add('reserved');
    for (let boxNumber = 15; boxNumber >= 0; boxNumber--) {
        if (numbers.length === 2) {
            let usablePosBig, usablePosLess;
            if (reserved === 0) {
                usablePosBig = 2;
                usablePosLess = 1;
            } else if (reserved === 1) {
                usablePosBig = 2;
                usablePosLess = 0;
            } else if (reserved === 2) {
                usablePosBig = 1;
                usablePosLess = 0;
            } else {
                usablePosBig = 1;
                usablePosLess = 0;
            }
            let biggerNumber = returnMax(numbers[0], numbers[1]); 
            let lessNumber = returnMin(numbers[0], numbers[1]);
            countEven(biggerNumber);
            countEven(lessNumber);
            if (evenness % 2 === 1) {
                insertNumbers(usablePosLess, biggerNumber);
                insertNumbers(usablePosBig, lessNumber);
                evenness++;
            } else {
                insertNumbers(usablePosLess, lessNumber);
                insertNumbers(usablePosBig, biggerNumber);
            }
            boxNumber = -1;
        } else {
            if (boxNumber == reserved) {
                continue;
            }
            do {
                loopNumber = randomInteger(1, 15);
            } while(usedNumbers.indexOf(loopNumber) != -1)
            countEven(loopNumber);
            usedNumbers.push(loopNumber);
            numbers.splice(numbers.indexOf(loopNumber), 1);
            insertNumbers(boxNumber, loopNumber);
        }
    }  
    highlight(boxes[reserved]);
    currentBox = boxes[reserved];
    startTime = Date.now();
    console.log(evenness);
    window.addEventListener('keydown', moveBox);
}

function changeStyle(picked, reserved) {
    picked.textContent = reserved.textContent;
    picked.classList.remove('reserved');
    reserved.classList.add('reserved');
    reserved.textContent = '';
}

function highlight(elem) {
    if (boxes.indexOf(elem) % 4 !== 0) {
        boxes[ boxes.indexOf(elem) - 1 ];
    }
    if (boxes.indexOf(elem) % 4 !== 3) {
        boxes[ boxes.indexOf(elem) + 1 ];
    }
    if (boxes.indexOf(elem) > 3) {
        boxes[ boxes.indexOf(elem) - 4 ];
    }
    if (boxes.indexOf(elem) < 12) {
        boxes[ boxes.indexOf(elem) + 4 ];
    }
}

function isWinner() {
    if (boxes[15].classList.contains('reserved')) {
        console.log(3);
        for (let i = 0; i < boxes.length - 1; i++) {
            if (i + 1 == boxes[i].textContent) continue;
            else return false;
        }
        return true;
    }
}

function showWinner() {
    let resTime = Date.now();
    let timeMS = resTime - startTime;
    let s = timeMS / 1000;
    let h = Math.floor(s / 3600);
    s = s - h*3600;
    let m = Math.floor(s/60);
    s = Math.floor(s - m*60);
    h = h > 9 ? h : '0' + h;
    m = m > 9 ? m : '0' + m;
    s = s > 9 ? s : '0' + s;
    timeCounter.innerHTML = `Wasted time: ${h}h:${m}m:${s}s`;
    timeCounter.style.display = 'block';
    document.body.style.background = 'lightyellow';
    window.removeEventListener('keydown', moveBox);
}

function moveBox(event) {
    let key = event.keyCode;
    if (key === 37) {
        if (boxes.indexOf(currentBox) % 4 != 0) {
        changeStyle(currentBox, boxes[boxes.indexOf(currentBox) - 1]);
        currentBox = boxes[boxes.indexOf(currentBox) - 1];
        }
    } else if (key === 38) {
        if (boxes.indexOf(currentBox) > 3) {
            changeStyle(currentBox, boxes[boxes.indexOf(currentBox) - 4]);
            currentBox = boxes[boxes.indexOf(currentBox) - 4];
        }
    } else if (key === 39) {
        if (boxes.indexOf(currentBox) % 4 != 3) {
            changeStyle(currentBox, boxes[boxes.indexOf(currentBox) + 1]);
            currentBox = boxes[boxes.indexOf(currentBox) + 1];
        }
    } else if (key === 40) {
        if (boxes.indexOf(currentBox) < 12) {
            changeStyle(currentBox, boxes[boxes.indexOf(currentBox) + 4]);
            currentBox = boxes[boxes.indexOf(currentBox) + 4];
        }
    }
    res = isWinner();
    if (res) {
        showWinner();
        return;
    }
    highlight(currentBox);

}

let currentBox, res, picked, loopNumber, usedNumbers, numbers, startTime, numberMoves;
let boxes = document.querySelectorAll('.boxes');
boxes = [].slice.call(boxes);
let wrapper = document.querySelector('.wrapper');
let timeCounter = document.getElementById('time-counter');
let againBtn = document.getElementsByClassName('start-again')[0];
let reserved;
let evenness = 0; 

defineNumbers();

againBtn.addEventListener('click', defineNumbers);