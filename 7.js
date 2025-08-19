const timer = () => {
    function hello() {
        return "Hello!";
    }
    setTimeout(hello, 2000);
}

const timerNew = () => {
    let count = 0;
    function counting() {
        count++;
        console.log("Counting" + count);
    }
    const id = setInterval(counting, 1000);

    setTimeout(()=> {
        clearInterval(id);
        console.log("Timer stopped");
    } ,5000)
}