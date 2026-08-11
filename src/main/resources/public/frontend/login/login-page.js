/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */
const usernameEle = document.getElementById ("login-input");
const passwordEle = document.getElementById ("password-input");
const loginBtn = document.getElementById ("login-button");
const logoutBtn = document.getElementById ("logout-button");

/* 
 * TODO: Add click event listener to login button
 * - Call processLogin on click
 */
loginBtn.addEventListener ("click", processLogin);

/**
 * TODO: Process Login Function
 * 
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 * 
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 */
async function processLogin() {
    // TODO: Retrieve username and password from input fields
    // - Trim input and validate that neither is empty

    const username = usernameEle.value.trim ();
    const password = passwordEle.value.trim ();

    // TODO: Create a requestBody object with username and password
    let requestBody = {};
    if (username && password) {
        requestBody = {username, password};
    }

    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(requestBody)
    };

    try {
        // TODO: Send POST request to http://localhost:8081/login using fetch with requestOptions
        const response = await fetch ("http://localhost:8081/login", requestOptions);
       

        // TODO: If response status is 200
        // - Read the response as text
        // - Response will be a space-separated string: "token123 true"
        // - Split the string into token and isAdmin flag
        // - Store both in sessionStorage using sessionStorage.setItem()
        

        // TODO: Optionally show the logout button if applicable

        // TODO: Add a small delay (e.g., 500ms) using setTimeout before redirecting
        // - Use window.location.href to redirect to the recipe page

        // TODO: If response status is 401
        // - Alert the user with "Incorrect login!"

        // TODO: For any other status code
        // - Alert the user with a generic error like "Unknown issue!"

        if (response.status === 200) {
            const text = await response.text ();
            const [token, isAdmin] = text.split (" ");
            sessionStorage.setItem ("auth-token", token);
            sessionStorage.setItem ("is-admin", isAdmin);

            console.log ("9999 session token: ", token, " is-admin: ", isAdmin, " :", sessionStorage.getItem("is-admin"))
            
            logoutBtn.setAttribute ("hidden", false);
            setTimeout (() => (window.location.href = "http://localhost:8083/recipe/recipe-page.html"), 500);
        }
        else if (response.status == 401) {
            alert ("Incorrect login!");
        }
        else {
            alert ("Unknown issue!");
        }

    } catch (error) {
        // TODO: Handle any network or unexpected errors
        // - Log the error and alert the user
        console.log ("Error: ", error.message);
        alert (error.message);
    }
}

