/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
   //Add
    const addRecipeNameEle = document.getElementById ("add-recipe-name-input");
    const addInstructionsEle = document.getElementById ("add-recipe-instructions-input");
    const addRecipeBtn = document.getElementById ("add-recipe-submit-input");

    //Update
    const updateRecipeNameEle = document.getElementById ("update-recipe-name-input");
    const updateInstructionsEle = document.getElementById ("update-recipe-instructions-input");
    const updateRecipeBtn = document.getElementById ("update-recipe-submit-input");

    //Delete
    const deleteRecipeNameEle = document.getElementById ("delete-recipe-name-input");
    const deleteRecipeBtn = document.getElementById ("delete-recipe-submit-input");

    //search
    const searchInputEle = document.getElementById ("search-input");
    const searchBtn = document.getElementById ("search-button");

    //Recipe List
    const recipeListEle = document.getElementById ("recipe-list");

    //Admin Link
    const adminLinkEle = document.getElementById ("admin-link");

    //Logout
    const logoutBtn = document.getElementById ("logout-button");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem ("auth-token")) {
        logoutBtn.setAttribute ("hidden", false);
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem ("is-admin") === "true") {
        adminLinkEle.setAttribute ("hidden", false);
    }
    // else {
    //     adminLinkEle.setAttribute ("hidden", true);
    // }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeBtn.addEventListener ("click", addRecipe);
    updateRecipeBtn.addEventListener ("click", updateRecipe);
    deleteRecipeBtn.addEventListener ("click", deleteRecipe);
    searchBtn.addEventListener ("click", searchRecipes);
    logoutBtn.addEventListener ("click", processLogout);


    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes ();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const name = searchInputEle.value.trim();
        try {
            const response  = await fetch (`${BASE_URL}/recipes/?name=${name}`, {
                                        method: "GET",
                                        headers: {
                                            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                                        }});
            recipes = [];
            recipes = await response.json();
            refreshRecipeList ();
        }
        catch (error) {
            console.log ("Error: ", error.message);
            alert ("Error: ", error.message);
        }

    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const name = addRecipeNameEle.value.trim ();
        const instructions = addInstructionsEle.value.trim();
        if (!(name && instructions)) {
            alert ("Recipe Name and Instructions are required to Add a Recipe!")
        }
        else {
            try {
                const requestBody = {name, instructions};
                const response = await fetch (`${BASE_URL}/recipes`, {
                                method: "POST",
                                headers: {
                                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                                },
                                body: requestBody
                            });
                if (response.ok) {
                    //clear inputs
                    document.querySelectorAll ("input, textarea").forEach(element => {
                                                                element.value = "";
                                                            });
                    getRecipes ();
                }
            }
            catch (error) {
                console.log ("Error: ", error.message);
                alert ("Error: ", error.message);
            }
            
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name = updateRecipeNameEle.value.trim ();
        const instructions = updateInstructionsEle.value.trim ();
        if (!(name && instructions)) {
            alert ("Recipe Name and Instructions are required to Update a Recipe!");
        }
        else {
            let recipeUpdateId = "";
            for (const recipe of recipes) {
                if (recipe.name === name) {
                    recipeUpdateId = recipe.id;
                    break;
                }
            }
        
            try {
                const requestBody = {name, instructions};
                const response = await fetch (`${BASE_URL}/recipes/${recipeUpdateId}`, {
                                method: "PUT",
                                headers: {
                                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                                },
                                body: requestBody
                            });
                if (response.ok) {
                    //clear inputs
                    document.querySelectorAll ("input, textarea").forEach ((element) => element.value = "");
                    getRecipes ();
                }
            }
            catch (error) {
                console.log ("Error: ", error.message);
                alert ("Error: ", error.message);
            }
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const name = deleteRecipeNameEle.value.trim ();
        let recipeDeleteId = "";
        for (const recipe of recipes) {
            if (recipe.name === name) {
                recipeDeleteId = recipe.id;
                break;
            }
        }

        try {
            const response = await fetch (`${BASE_URL}/recipes/${recipeDeleteId}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                            }
                        });
            if (response.ok) {
                recipes = recipes.filter ((recipe) => recipe.id !== recipeDeleteId);
            }
        }
        catch (error) {
            console.log ("Error: ", error.message);
            alert ("Error: ", error.message);
        }
    }


    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            response = await fetch (`${BASE_URL}/recipes`, {method: "GET",
                                headers: {
                                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                                }});
            recipes = [];
            recipes = await response.json ();
            refreshRecipeList ();
        }
        catch (error) {
            console.log ("Error: ", error.message);
            alert ("Error: ", error.message);
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeListEle.innerHTML = "";  //clear current list

        for (const recipe of recipes) {
            const liEle = document.createElement ("li");
            liEle.innerHTML = `<a href="${BASE_URL}/recipe-page?id=${recipe.id}">
                                    <h3>${recipe.name}</h3>
                                    <p>${recipe.instructions}</p>
                                </a>`;

            recipeListEle.appendChild (liEle);
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here

        const authToken = sessionStorage.getItem ("auth-token");
            try {
                const response = fetch (`${BASE_URL}/logout`, {method:"POST",
                                        headers: {
                                            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                                        },
                                        body:authToken });
                
                if (response.ok) {
                    sessionStorage.clear ();
                    window.location.href = `${BASE_URL}/login`;
                }
                else {
                    alert ("Error during logout!");
                }
            }
        catch (error) {
            console.log ("Error: ", error.message);
            alert ("Error: ", error.message);
        }
    }

});
