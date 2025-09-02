const mixed = [2, "apple", 7, "banana", 10, "cherry"];
const arrayUpperCase = (mixed) => mixed.filter(str => typeof str  === "string").map(str => str[0].toUpperCase() + str.slice(1))

