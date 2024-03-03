import { API_URL } from "./api_url.mjs";

const emailInput = document.querySelector("#login-email");
const passwordInput = document.querySelector("#login-password");
const loginForm = document.querySelector("#login-form");
const errorContainer = document.querySelector("#login-error-container");

const loginURL = `${API_URL}/auction/auth/login`;

loginForm.addEventListener("submit", login);

/**
 * function to login a user
 * @param {Object} e - event emitter with preventDefault() function
 */
function login(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const userData = {
    email,
    password,
  };

  fetch(loginURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Login failed. Please check your credentials and try again."
        );
      }
      return response.json();
    })
    .then((data) => {
      // Handle successful login
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("credits", data.credits);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("avatar", data.avatar);
      localStorage.removeItem("easybid");

      window.location.href = "/";
    })
    .catch((error) => {
      displayError(error.message);
    });
}

/**
 * Displays an error message in the specified error container.
 * @param {string} errorMessage - The error message to display
 */
function displayError(message) {
  errorContainer.innerHTML = `<p class="error-message">${message}</p>`;
}
