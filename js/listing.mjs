import { API_URL, GET_LISTINGS } from "./api_url.mjs";

let listingsContainer = document.querySelector("#listings-container");
let searchInput = document.querySelector("#search-input");

const baseURL = `${API_URL}/auction${GET_LISTINGS}`;

// fetch listings
async function fetchListings() {
  try {
    const response = await fetch(baseURL);
    let data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Invalid data format: expected an array.");
      return;
    }

    render(data);

    searchListings(data);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

fetchListings();

function render(data) {
  listingsContainer.innerHTML = "";

  if (data.length === 0) {
    listingsContainer.innerHTML = "<h2>No listing found</h2>";
    return;
  }

  data.forEach((listing) => {
    const listingElement = createListingElement(listing);

    listingsContainer.appendChild(listingElement);
  });
}

// create a listing element
function createListingElement(listing) {
  const listingElement = document.createElement("div");
  listingElement.classList.add(
    "col-lg-3",
    "col-md-4",
    "col-sm-6",
    "col-12",
    "mb-4"
  );

  // listing HTML with fallback image
  const imageSrc =
    listing.media && listing.media.length > 0
      ? listing.media[0]
      : "fallback-image.jpg";
  listingElement.innerHTML = `
      <div class="card flex-item p-3 h-100">
          <img src="${imageSrc}" class="card-img-top img-fluid h-100" alt="Listing Image">
          <div class="card-body d-flex flex-column justify-content-between">
              <div>
                  <h5 class="card-title text-truncate mb-3">${listing.title}</h5>
                  <p class="card-text mb-3">Current Bid: <span class="text-success-emphasis fw-bold">${listing._count.bids}</span></p>
              </div>
              <a href="/listing-details/index.html?listingId=${listing.id}" class="btn btn-primary align-self-start">View More</a>
          </div>
      </div>
  `;
  return listingElement;
}

// filter listings based on search input
function searchListings(allListings) {
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredListings = allListings.filter((listing) =>
      listing.title.toLowerCase().includes(searchTerm)
    );
    render(filteredListings);
  });
}
