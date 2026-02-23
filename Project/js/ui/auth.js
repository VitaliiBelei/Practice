// Authentication UI components

export function registerProfile() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Register</h2>
        <form id="registerForm">
            <img src="img/foto.png" alt="Image preview" id="image-preview-profile">
            <input class="mainbutton" type="file" name="foto" accept="image/*">
            <div id='register-values'>
                <div class='form-group'>
                    <label for="name">Name:</label>
                    <input type="text" name="name" required>
                </div>
                <div class='form-group' id='email-register'>
                    <label for="email">Email:</label>
                    <input type="email" name="email" required>
                </div>
                <div class='form-group' id='password-register'>
                    <label for="password">Password:</label>
                    <input type="password" name="password" required>
                    <label for="password">Confirm password:</label>
                    <input type="password" name="confirm-password" required>
                </div>
                <button class="mainbutton" type="submit">Register</button>
            </div>
        </form>
    `;
}

export function loginProfile() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Login</h2>
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" name="password" required>
            </div>
            <button class="mainbutton" type="submit">Login</button>
        </form>
    `;
}
