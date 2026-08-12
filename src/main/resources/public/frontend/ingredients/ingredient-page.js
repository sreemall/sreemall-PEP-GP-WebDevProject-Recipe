/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
    const addIngredientNameEle = document.getElementById ("add-ingredient-name-input");
    const deleteIngredientNameEle = document.getElementById ("delete-ingredient-name-input");
    const ingredientListContainerEle = document.getElementById ("ingredient-list");
/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
const addBtn = document.getElementById ("add-ingredient-submit-button");
const deleteBtn = document.getElementById ("delete-ingredient-submit-button");

addBtn.addEventListener ("click", addIngredient);
deleteBtn.addEventListener ("click", deleteIngredient);

/*
 * TODO: Create an array to keep track of ingredients
 */
    let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
    window.addEventListener ("DOMContentLoaded", getIngredients);

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const name = addIngredientNameEle.value.trim ();
    if (!name) {
        alert ("Ingredient Name is Required to Add Ingredient!");
    }
    else {
        try {
            const response = await fetch (`${BASE_URL}/ingredients`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                                },
                                body: JSON.stringify({ name })
                            });

            if (response.ok) {
                document.querySelectorAll ("input").forEach(element => element.value = "");
                getIngredients ();
            }
            else {
                alert (`Error during Add an Ingredient! Error: ${response.status}`);
            }

        }
        catch (error) {
            console.log ("Error: ", error.message);
            alert (`Error: ${error.message}`);
        }
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const response = await fetch (`${BASE_URL}/ingredients`, {
                                    method: "GET",
                                    headers: {
                                        "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                                    }
                                });
        ingredients = await response.json ();
        refreshIngredientList ();
    }
    catch (error) {
        console.log ("Error: ", error.message);
        alert (`Error: ${error.message}`);
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const name = deleteIngredientNameEle.value.trim ();

    const ingredientDelete = ingredients.find ((ingredient) => ingredient.name === name);
    if (!ingredientDelete) {
        alert ("Ingredient not found!");
        return;
    }
    try {
        const response = await fetch (`${BASE_URL}/ingredients/${ingredientDelete.id}`, {
                                    method: "DELETE",
                                    headers: {
                                        "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                                    }});
        if (response.ok) {
            getIngredients ();
        }
        else {
            alert(`Error: ${(await response).status} during Delete an Ingredient`);
        }
    }
    catch (error) {
        console.log ("Error: ", error.message);
        alert (`Error: ${error.message}`);
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainerEle.innerHTML = "";
    for (const ingredient of ingredients) {
        const liEle = document.createElement ("li");
        liEle.innerHTML = `<p>${ingredient.name}</p>`
        ingredientListContainerEle.appendChild (liEle);
    }
}
