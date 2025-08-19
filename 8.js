function getData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (resolve) 
                {resolve("Hello!")}
            else reject('Error')
        }, 2000)
        }
    )
}
getData()
.then(result => console.log(result))
.catch(error => console.error(erro))


function fetchUser(name) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (name) {
                resolve("User data: " + name)
            }
            else reject("No user found")
        }, 2000)
    })
}
fetchUser()
.then(result => console.log(result))
.catch(error => console.error(error))
.finally(() => console.log("request finished"))

function getNumber() {
    const number = Math.floor(Math.random() * 10) + 1;
    return new Promise((resolve, reject) => {
        if (number>1 && number<10 && number%2 === 0) {
            resolve(number);
        }
        else if (number <= 1 || number >= 10) {
            reject("Number out of range: " + number);
        }
        else reject("Odd number: "+ number);
    })
}
getNumber()
.then(result => console.log(result))
.catch(error=>console.error(error))
.finally(()=>console.log("Finished checking number"))


async function run() {
    try {
        const result= await getNumber();
        console.log(result);
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
        console.log("Finished checking number");
    }
}