// Common recipe list rendering functionality
import { recipeCard } from "./recipe.js";

export function renderRecipes(recipes, mode = "list") {
    let paginationWrapper = null;
    let currentPage = 1;
    const itemsPerPage = 10;

   
    const container = document.getElementById("recipes");
    if (!container) return;
    container.innerHTML = "";
    const recipeContainer = document.createElement("div");
    recipeContainer.id = "recipe-container";
    container.appendChild(recipeContainer);

    container.className = "recipes-container";

    if (!recipes || recipes.length === 0) {
        container.innerHTML = `<p>No recipes found</p>`;
        const c = document.getElementById("counter");
        if (c) c.textContent = "Found: 0 recipes";
        return;
    }

    const c = document.getElementById("counter");
    if (c) c.textContent = `Found: ${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`;

    

    function setActivePageBtn(page) {
        if (!paginationWrapper) return;
        const activeBtn = paginationWrapper.querySelector(`.page-btn[data-page="${page}"]`);
        if (activeBtn) {
            paginationWrapper.querySelectorAll('.page-btn').forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-current');
            });
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-current', 'page');
        }
    }

    function buildPagination () {
        if (paginationWrapper) {
            paginationWrapper.remove();
            paginationWrapper = null;
        }
        if (recipes.length <= itemsPerPage) return;

        const totalPages = Math.ceil(recipes.length/itemsPerPage);
        paginationWrapper = document.createElement('div');
        paginationWrapper.className = 'pagination-wrapper';

        paginationWrapper.innerHTML = Array.from({ length: totalPages }, (_, i) =>
            `<button class="page-btn" data-page="${i + 1}">${i + 1}</button>`
        ).join('');
        container.appendChild(paginationWrapper);

        // listener for paginaion
        paginationWrapper.addEventListener('click', (e) => {
            if (!(e.target instanceof Element)) return;
            const btn = e.target.closest('.page-btn');
            if (!(btn instanceof HTMLButtonElement)) return;
            e.preventDefault();
            currentPage = Number(btn.dataset.page);
            showPage(currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage; 
        recipeContainer.innerHTML = recipes.slice(start,end).map((recipe) => recipeCard(recipe, mode)).join("");
        buildPagination();
        setActivePageBtn(page);
    }
    
    if (currentPage === 1) {
        showPage(currentPage);
    }
    
}

