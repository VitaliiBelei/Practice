const counter = makeCounter();
function makeCounter () {
    let count = 0;
    const countAdd = () => {
        count = count + 1;
        return count;
    }
    return countAdd;
}
