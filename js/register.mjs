import { API_URL } from "./api_url.mjs";

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const registerForm = document.querySelector("#register-form");
const errorContainer = document.querySelector("#error-container");

const baseURL = `${API_URL}/auction/auth/register`;

registerForm.addEventListener("submit", register);

/**
 * function to register a user
 * @param {Object} e - event emitter with preventDefault() function
 */
function register(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!isValidPasswordConfirmation(password, confirmPassword)) {
    displayError("Passwords do not match.");
    return;
  }

  const userData = {
    name,
    email,
    password,
  };

  fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Registration failed. Please try again.");
      }
      return response.json();
    })
    .then((data) => {
      if (data?.id) {
        alert("Successfully registered, login now!");

        const registerModal = document.getElementById("registerModal");
        const bootstrapRegisterModal =
          bootstrap.Modal.getInstance(registerModal);
        bootstrapRegisterModal.hide();
        const loginModal = document.getElementById("loginModal");
        const bootstrapLoginModal = new bootstrap.Modal(loginModal);
        bootstrapLoginModal.show();
      }
    })
    .catch((error) => {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        displayError("Network error. Please check your internet connection.");
      } else {
        displayError(
          "Registration failed. Please try other Username or Email name."
        );
      }
    });
}

/**
 * The password confirmation value must match the password.
 * @param {string} password - The password to compare
 * @param {string} confirmPass - The confirmation password to validate
 * @returns {boolean} - True if the passwords match, false otherwise
 */
function isValidPasswordConfirmation(password, confirmPassword) {
  return password === confirmPassword;
}

/**
 * Displays an error message in the specified error container.
 * @param {string} errorMessage - The error message to display
 */
function displayError(message) {
  errorContainer.innerHTML = `<p class="error-message">${message}</p>`;
}
