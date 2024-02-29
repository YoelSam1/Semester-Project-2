import { API_URL } from "./api_url.mjs";

let listingDetailsContainer = document.querySelector(".feed-details");
const listingID = window.location.href.split("=")[1];
const baseURL = `${API_URL}/auction/listings/${listingID}`;

// Function to fetch listing details
function fetchListingDetails() {
  fetch(baseURL)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.status}`);
      }
      return res.json();
    })
    .then((listing) => {
      const { title, created, tags, description, media, _count } = listing;

      // Construct HTML to display listing details
      listingDetailsContainer.innerHTML = `
        <h2 class="card-title">${title}</h2>
        <h6 class="card-subtitle mb-2 text-body-secondary">Created: ${created}</h6>
        <p>Description: ${description}</p>
        <p>Current Bid Count: ${_count.bids}</p>
        <img src="${media[0]}" alt="Listing Image" class="img-fluid">
      `;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// Fetch and render listing details and bids
fetchListingDetails();
