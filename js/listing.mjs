import { API_URL } from "./api_url.mjs";
import { displaySpinner, hideSpinner } from "./spinner.mjs";

let listingsContainer = document.querySelector("#listings-container");
let searchInput = document.querySelector("#search-input");

const baseURL = `${API_URL}/auction/listings`;

// Function to fetch listings
async function fetchListings() {
  try {
    const response = await fetch(baseURL);
    let data = await response.json();

    // Sort the data based on the 'created' property
    data.sort((a, b) => new Date(b.created) - new Date(a.created));

    render(data);

    // Event listener for search input
    searchInput.addEventListener("input", () => {
      const text = searchInput.value.toLowerCase();
      const searchedData = data.filter(
        (d) =>
          (d.body && d.body.toLowerCase().includes(text)) ||
          (d.title && d.title.toLowerCase().includes(text))
      );
      render(searchedData);
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

// Fetch listings when the page loads
fetchListings();

// Function to render data
function render(data) {
  listingsContainer.innerHTML = "";

  if (data.length === 0) {
    listingsContainer.innerHTML = "<h2>No listing found</h2>";
    return;
  }

  // Iterate through data in reverse order to ensure latest listing appears at the top
  for (let i = data.length - 1; i >= 0; i--) {
    const listing = data[i];

    const listingElement = document.createElement("div");
    listingElement.classList.add(
      "col-lg-3",
      "col-md-4",
      "col-sm-6",
      "col-12",
      "mb-4"
    );

    // Construct listing HTML with fallback image
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

    // Insert the listing element at the beginning of the container
    listingsContainer.insertAdjacentElement("afterbegin", listingElement);
  }
}
