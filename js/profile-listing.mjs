import { API_URL } from "./api_url.mjs";
import { fetchMetdhods } from "../api/fetch-methods.mjs";

const { getListings, getListing } = fetchMetdhods;

//  fetch listings
async function fetchListings() {
  try {
    const name = localStorage.getItem("name");
    const baseURL = `${API_URL}/auction/listings/${listingID}?_seller=true&_bids=true`;
    const response = await fetch(baseURL, getListing);
    if (!response.ok) {
      throw new Error("Failed to fetch listings");
    }
    const json = await response.json();
    render(json);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

fetchListings();

function render(data) {
  const listingsContainer = document.querySelector("#cards-container");
  listingsContainer.innerHTML = "";

  if (data.length === 0) {
    listingsContainer.innerHTML = "<h2>No listings found</h2>";
    return;
  }

  data.forEach((listing) => {
    const listingElement = createListingElement(listing);
    listingsContainer.appendChild(listingElement);
  });
}

function createListingElement(listing) {
  const formattedPostDate = new Date(listing.created).toLocaleDateString(
    "en-us",
    { month: "short", day: "numeric" }
  );
  const formattedPostTime = new Date(listing.created).toLocaleTimeString(
    "en-GB",
    { hour: "2-digit", minute: "2-digit" }
  );

  const formattedDeadlineDate = new Date(listing.endsAt).toLocaleDateString(
    "en-us",
    { month: "short", day: "numeric" }
  );
  const formattedDeadlineTime = new Date(listing.endsAt).toLocaleTimeString(
    "en-GB",
    { hour: "2-digit", minute: "2-digit" }
  );

  const listingElement = document.createElement("div");
  listingElement.classList.add("col");
  listingElement.innerHTML = `
    <div class="card h-100">
      <a href="/item.html?id=${listing.id}">
        <img src="${listing.media[0]}" class="card-img-top" alt="Image caption: ${listing.title}">
      </a>
      <div class="card-body">
        <a href="/item.html?id=${listing.id}" class="text-decoration-none">
          <h3 class="card-title">${listing.title}</h3>
        </a>
        <p class="card-text">${listing.description}</p>
      </div>
      <div class="card-footer">
        <p class="mb-0"><strong>Bids: </strong>${listing._count.bids}</p>
        <p class="mb-0"><strong>Created: </strong>${formattedPostDate} <span class="small text-muted">| ${formattedPostTime}</span></p>
        <p class="mb-0"><strong>Ends at: </strong>${formattedDeadlineDate} <span class="small text-muted">| ${formattedDeadlineTime}</span></p>
        <a href="/item.html?id=${listing.id}" class="btn btn-primary">Open</a>
      </div>
    </div>`;
  return listingElement;
}
