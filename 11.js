const users = [
  { id: 1, name: "Alice", age: 22 },
  { id: 2, name: "Bob", age: 17 },
  { id: 3, name: "Charlie", age: 30 }
];

const id = users.find(u => u.id === 2);
console.log("User with id=2",id);

const yang = users.some(u => u.age<18);
console.log("User yanger 18: ", yang);

const every = users.every(u => u.age>15);
console.log("Users older 15: ", every);


const numbers = [5, 10, 15, 20];

const summ = numbers.reduce((acc,cur)=>{
    return acc + cur;
}, 0);

const a = numbers.reduce((acc,cur)=>{
    return acc > cur ? acc : cur;
})

const users1 = [
  { id: 1, name: "Alice", age: 22 },
  { id: 2, name: "Bob", age: 17 },
  { id: 3, name: "Charlie", age: 30 },
  { id: 4, name: "David", age: 15 },
  { id: 5, name: "Eve", age: 19 }
];

const fullYear = users1.reduce((acc,cur)=> {
    return cur.age>18 ? acc+1 : acc
},0);


const arr = [1, 2, [3, 4], 5, [6]];

arr.includes(4);

arr.flatMap(i => i).includes(4);