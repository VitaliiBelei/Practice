// Authentication UI components

export function registerProfile() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Register</h2>
        <form id="registerForm">
            <img src="img/foto.png" alt="Image preview" id="imagePreview-profile">
            <label for="foto">Profile Photo URL:</label>
            <input type="file" name="foto" accept="image/*">
            <label for="name">Name:</label>
            <input type="text" name="name" required>
            <label for="email">Email:</label>
            <input type="email" name="email" required>
            <label for="password">Password:</label>
            <input type="password" name="password" required>
            <button type="submit">Register</button>
        </form>
    `;
}

export function loginProfile() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Login</h2>
        <form id="loginForm">
            <label for="email">Email:</label>
            <input type="email" name="email" required>
            <label for="password">Password:</label>
            <input type="password" name="password" required>
            <button type="submit">Login</button>
        </form>
    `;
}