const person = {
  name: "Alex",
  sayHi: function() {
    console.log("Hi, I am " + this.name);
  }
};

setTimeout(person.sayHi.bind(person), 1000);


function multiplier (n) {
    return function(x) {
        return x*n;
    }
}

function createCounter() {
    let count =0;
    return {
        increment: function() {
            count ++;
            return count;
        },
        decrement: function() {
            count --;
            return count;
        }
    }
}