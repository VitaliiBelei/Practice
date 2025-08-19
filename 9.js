 async function getUsers() {
    try {
        const result = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!result.ok) {
            throw new Error("HTTP error: " + result.status);
        }
        const data = await result.json();
        console.log(data);
    }
    catch (error) {
        console.error("Error:", error)
    }
 }

 async function getUserById(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }
        const user = await response.json();
        console.log("User name: ", user.name);
    }
    catch (error) {
        console.error("Error:", error);
    }
 }

 getUserById(3);