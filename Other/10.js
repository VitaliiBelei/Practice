async function createUser(name, email) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: name,
                email: email
            })
        });
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status)
        }
        const newUser = await response.json();
        console.log("Created new user:", newUser);
    }
    catch(error) {
        console.error("Error",error);
    }
}

async function updateUser(id, newData) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newData)
        });
        if (!response.ok) {
            throw new Error("Http error: " + response.status)
        }
        const updatedUser = await response.json();
        console.log("Updated data:", updatedUser);
    }
    catch(error) {
        console.error("Error",error);
    }
}

updateUser (3, {email: "updated@example.com"});


async function deleteUser(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {method: "DELETE"});
        if (!response.ok) {
            throw new Error("HTTP error:" + response.status);
        }
        console.log(`Deleted user with id ${id}`);
    }
    catch (error) {
        console.error("Error:", error)
    }
}

deleteUser(3);