const numbers = [2,5,8,10,3];

const pairNumbers = (numbers) => numbers.filter(num => num%2===0);


function pairNumbers(numbers) {
    return numbers.filter(function(num) {
        return num % 2 ===0;
    })
    }

const pairMultiple = (numbers) => numbers.filter(num => num%2===0).map(num => num*3);