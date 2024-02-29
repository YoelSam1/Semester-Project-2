// Function to display spinner
export function displaySpinner() {
  const spinnerContainer = document.querySelector("#loader");
  spinnerContainer.classList.remove("d-none");
}

// Function to hide spinner
export function hideSpinner() {
  const spinnerContainer = document.querySelector("#loader");
  spinnerContainer.classList.add("d-none");
}
