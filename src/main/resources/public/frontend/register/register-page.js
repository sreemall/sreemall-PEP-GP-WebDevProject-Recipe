/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
const usernameEle = document.getElementById ("username-input");
const emailEle = document.getElementById ("email-input");
const passwordEle = document.getElementById ("password-input");
const repeatPasswordEle = document.getElementById ("repeat-password-input");
const registerBtn = document.getElementById ("register-button");

/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerBtn.addEventListener ("click", processRegistration);


/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    // Implement registration logic here
    const username = usernameEle.value.trim ();
    const email = emailEle.value.trim ();
    const password = passwordEle.value.trim ();
    const repeatPassword = repeatPasswordEle.value.trim ();

    if (!(username && email && password && repeatPassword)) {
        alert ("Please fill all the fields!");
    }
    else if (password !== repeatPassword) {
        alert ("Password and Repeat Password are not same!");
    }
    else {  // all valid data
        const registerBody = {username, email, password};

    // Example placeholder:
    // const registerBody = { username, email, password };
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
            body: JSON.stringify(registerBody)
        };
    // await fetch(...)
        try {
            const response = await fetch (`${BASE_URL}/register`, requestOptions);
            if (response.status === 201) {
                window.location.href = `${BASE_URL}/login`;
            }
            else if (response.status === 409 ) {
                alert ("user/email already exists");
            }
            else {
                alert ("Registration Error");
            }
        }
        catch (error) {
            console.log (error.message);
            alert ("Error: ", error.message);
        }
    }
}
