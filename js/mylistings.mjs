import { API_URL } from "./api_url.mjs";
import { deleteListing, updateListing } from "./update-delete.mjs";

async function fetchListings() {
  const userName = localStorage.getItem("name");
  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.error("Token is null or empty. Please log in again.");
    return Promise.reject("User not authenticated or missing access token.");
  }

  // Construct the API endpoint URL
  const url = `${API_URL}/auction/profiles/${userName}/listings`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Failed to fetch listings.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

function displayListings(listings) {
  const cardsContainer = document.getElementById("cards-container");

  cardsContainer.innerHTML = "";

  listings.forEach((listing) => {
    const card = document.createElement("div");
    card.classList.add("col", "mb-4");
    card.setAttribute("id", listing.id);
    card.innerHTML = `
      <div class="card h-100">
        <img src="${listing.media[0]}" class="card-img-top" alt="Listing Image">
        <div class="card-body">
          <h5 class="card-title">${listing.title}</h5>
          <p class="card-text">${listing.description}</p>
          <p class="card-text">Bids: ${listing._count.bids}</p>
        </div>
        <div class="card-footer">
          <small class="text-muted">Ends at: ${new Date(listing.endsAt).toLocaleString()}</small>
          <div class="mt-2">
            <button class="btn btn-primary me-2 update-button" data-listing-id="${listing.id}">Update</button>
            <button class="btn btn-danger delete-button" data-listing-id="${listing.id}">Delete</button>
          </div>
        </div>
      </div>
    `;
    cardsContainer.appendChild(card);
  });

  const updateButtons = document.querySelectorAll(".update-button");
  updateButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const listingId = event.target.dataset.listingId;
      handleUpdateButtonClick(listingId);
    });
  });
}

function handleDeleteButtonClick(listingId) {
  deleteListing(listingId)
    .then(() => {
      const deletedListingElement = document.getElementById(listingId);
      if (deletedListingElement) {
        deletedListingElement.remove();
        alert("Listing deleted successfully!");
      }
    })
    .catch((error) => {
      console.error("Failed to delete listing:", error);
      alert("Failed to delete listing. Please try again.");
    });
}

function handleUpdateButtonClick(listingId) {
  fetchListing(listingId)
    .then((listingData) => {
      // existing listing data
      document.getElementById("title").value = listingData.title;
      document.getElementById("description").value = listingData.description;
      document.getElementById("media").value = listingData.media[0];
      document.getElementById("endsAt").value = new Date(listingData.endsAt)
        .toISOString()
        .slice(0, 16);

      // listing modal
      const modal = new bootstrap.Modal(
        document.getElementById("createlistingModal")
      );
      modal.show();
    })
    .catch((error) => {
      console.error("Failed to fetch listing details:", error);
      alert("Failed to fetch listing details. Please try again.");
    });
}

function fetchListing(listingId) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.error("Token is null or empty. Please log in again.");
    return Promise.reject("User not authenticated or missing access token.");
  }

  const url = `${API_URL}/auction/listings/${listingId}`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch listing details.");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching listing details:", error);
      throw error;
    });
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const listings = await fetchListings();
    displayListings(listings);
  } catch (error) {
    console.error("Error loading listings:", error);
    alert("Failed to load listings. Please try again.");
  }
});

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-button")) {
    const listingId = event.target.dataset.listingId;
    handleDeleteButtonClick(listingId);
  }
});
