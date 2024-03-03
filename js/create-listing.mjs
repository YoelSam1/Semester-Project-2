import { API_URL } from "./api_url.mjs";

// Define the createListing function to create a new listing
function createListing(title, description, media, endsAt) {
  if (!title || !endsAt) return alert("Title and endsAt are required fields.");

  // Retrieve the authentication token from local storage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the authentication token is available
  if (!accessToken) {
    return alert(" To create listing need to login or register.");
  }

  // Construct the data object for the request
  const data = {
    title,
    description,
    media: [media],
    endsAt,
  };

  // Construct the request options
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken, // Include the access token in the headers
    },
    body: JSON.stringify(data),
  };

  // Define the base URL for the API endpoint
  const baseURL = `${API_URL}/auction/listings`;

  // Send the POST request to create a new listing
  fetch(baseURL, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Listing created:", data);
      alert("Listing created successfully!");
      // Reload the page after creating the listing
      location.reload();
    })
    .catch((error) => {
      console.error("Error creating listing:", error);

      alert("Error creating listing. Please try again.");
    });
}

// Add an event listener to the form submission
document
  .getElementById("createListingForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get input values from the form
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const media = document.getElementById("media").value;
    const endsAt = document.getElementById("endsAt").value;

    // Call the createListing function with input values
    createListing(title, description, media, endsAt);
  });
