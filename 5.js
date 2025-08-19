const numbers = [2, 5, 8, 10, 3];

function summAll(numbers) {
    return numbers.reduce(
        function summ(acc, cur) {
            return acc + cur
        } , 0
    )
}

const biggestNumber = (numbers) => numbers.reduce((acc,cur) => acc > cur ? acc : cur)

const words = ["apple", "banana", "cherry", "kiwi", "strawberry"];

const strLength = (words) => words.reduce((acc, cur) => acc.length > cur.length ? acc : cur);

const fruits = ["apple", "banana", "apple", "cherry", "banana", "apple"];

const numberOfFruits = (fruits) => fruits.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
}, {})