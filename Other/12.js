const users = [
  { id: 1, name: "Alice", age: 22 },
  { id: 2, name: "Bob", age: 17 },
  { id: 3, name: "Charlie", age: 30 }
];

console.log(Object.keys(users[0]));
console.log(Object.values(users[1]));
console.log(Object.entries(users[2]));

const entries = users.forEach(e => console.log(Object.entries(e)));

const values = users.map(u => Object.values(u));


const map = new Map();
map.set("id", 1);
map.set("name", "Bob");
map.set("age", 25);

console.log(map.get("name"));
console.log(map.has("age"));

for (let [key, value] of map) { 
  console.log(key, value);
}
