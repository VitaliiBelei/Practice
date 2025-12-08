// Profile display and editing components

export function loadProfilePage(profile = null, mode = "unlogin") {
    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>User Profile</h2>
        <div class='user-profile'>
            ${mode === "login" && profile
                ? `
                <div id="profile-foto">
                    <img src="${profile.foto}" alt="Profile Photo" />
                </div>
                <div id="profile-info">
                    <p><strong>Name: </strong>${profile.name}</p>
                    <p><strong>Email: </strong>${profile.email}</p>
                    <p><strong>Location: </strong>${profile.location || ""}</p>
                    <p><strong>Favorite Cuisine: </strong>${profile.fc || ""}</p>
                    <p><strong>Bio: </strong>${profile.bio || ""}</p>
                    <p><strong>Links: </strong> <a href="${profile.link}" target="_blank">${profile.link ||""}</a></p>
                    <p><strong>Member since: </strong>${profile.createdAt}</p>
                </div>
                `
                : `
                <h3>Welcome to Cookbook Social! Your place to share recipes, discover new flavors, and connect with food lovers from around the world. Save your favorite dishes, customize your cooking profile, and make every meal a story worth sharing.</h3>
                `
            }
        </div>
    `;
}

export function editProfile(profile) {
    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Edit Profile</h2>
        <form id="editProfileForm">
            <label for="foto">Profile Photo URL:</label>
            <img src="${profile.foto ?? "img/foto.png"}" alt="Image preview" id="image-preview-profile">
            <input type="file" name="foto" accept="image/*">
            <label for="name">Name:</label>
            <input type="text" name="name" value="${profile.name}" required>
            <label for="email">Email:</label>
            <input type="email" name="email" value="${profile.email}" required>
            <label for="location">Location:</label>
            <input type="text" name="location" value="${profile.location || ""}">
            <label for="fc">Favorite Cuisine:</label>
            <input type="text" name="fc" value="${profile.fc || ""}">
            <label for="bio">Bio:</label>
            <textarea name="bio">${profile.bio || ""}</textarea>
            <label for="link">Links:</label>
            <input type="url" name="link" value="${profile.link || ""}">
            <button type="submit">Save Changes</button>
        </form>
    `;
}
