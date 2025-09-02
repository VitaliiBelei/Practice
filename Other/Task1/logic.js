const nameValue = document.getElementById("name");
const button = document.getElementById("button");

button.addEventListener("click", onClick);

function onClick(event) {
        event.preventDefault();
        const onStorage = JSON.stringify(nameValue.value);
        localStorage.setItem("userName", onStorage);
    }

window.addEventListener("load", namePush);

function namePush() {
    const name= localStorage.getItem("userName");
    if (name) {
        document.getElementById("name").value = JSON.parse(name);
    }
}