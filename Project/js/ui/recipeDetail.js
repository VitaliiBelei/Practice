export function renderRecipeDetail(recipe) {
    const container = document.getElementById('app');
    if (!container) return;

    container.innerHTML = `
        <section class="section">
            <div class="container">
                <button id="backToRecipes" class="back-btn">← Back to Recipes</button>
                <h2 class="title">${recipe.title}</h2>
                <div class="recipe-main-image">
                    <img src="${recipe.mainImage ?? 'img/norecipe.png'}" alt="Image of ${recipe.title}">
                </div>
                <p><strong>Time:</strong> ${recipe.time} minutes</p>
                <p><strong>Servings:</strong> ${recipe.servings}</p>
                <h3 class="subtitle">Ingredients:</h3>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing.name}: ${ing.qty} ${ing.unit}</li>`).join("")}
                </ul>
                <h3 class="subtitle">Steps:</h3>
                <ol>
                    ${recipe.steps.map(step => `<li>${step}</li>`).join("")}
                </ol>
            </div>
        </section>
    `;

    // Add back button functionality
    const backButton = document.getElementById('backToRecipes');
    if (backButton) {
        backButton.onclick = async () => {
            try {
                const { recipesPage } = await import('../app.js');
                recipesPage();
            } catch (error) {
                console.error('Error importing recipesPage:', error);
                window.location.hash = '#/recipes';
            }
        };
    }
}
