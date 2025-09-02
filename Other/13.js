const button = document.getElementById("buttons");

buttons.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        console.log(event.target.dataset.color);
    }
})

const onChange = () => {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const checkForm = () => {
        if (username.value.trim() === "" || password.value.trim() === "") {
            console.log("Заповніть всі поля!");
            return false;
        }
        return true;
    }
    const onSubmit = () => {
        const form=document.getElementById("loginForm");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!checkForm()) return;
            console.log("Username: " + username.value + " is logged in");
        })
    }
    onSubmit();
}

