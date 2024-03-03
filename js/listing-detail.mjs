import { API_URL } from "./api_url.mjs";

// fetch single listing details
async function fetchListingDetails(listingId) {
  try {
    const response = await fetch(`${API_URL}/auction/listings/${listingId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch listing details");
    }
    const data = await response.json();
    renderListingDetails(data);
  } catch (error) {
    console.error("Error fetching listing details:", error);
  }
}

// render listing details
function renderListingDetails(listing) {
  try {
    // listing title
    const listingTitle = document.getElementById("listing-title");
    listingTitle.textContent = listing.title;

    // listing description
    const listingDescription = document.getElementById("description");
    listingDescription.textContent = listing.description;

    // current bid
    const currentBid = document.getElementById("current-bid");
    currentBid.textContent =
      listing._count.bids > 0 ? listing._count.bids : "NO BIDS";

    // Calculate time left
    const bidRemaining = document.getElementById("bid-remaining");
    const now = new Date();
    const endsAt = new Date(listing.endsAt);
    const timeLeft = endsAt - now;
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    bidRemaining.textContent = `${daysLeft}d ${hoursLeft}h ${minutesLeft}min`;
    // seller's username if available
    const seller = document.getElementById("listing-seller");
    if (listing.sellerUsername) {
      seller.textContent = listing.sellerUsername;
    } else {
      seller.textContent = "Unknown";
    }
    // image gallery
    const listingImgGallery = document.getElementById("listing-img-gallery");
    listingImgGallery.innerHTML = "";
    if (listing.media && listing.media.length > 0) {
      listing.media.forEach((imageUrl, index) => {
        const imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        imgElement.alt = `Listing Image ${index + 1}`;
        imgElement.classList.add("img-fluid");
        imgElement.addEventListener("click", function () {
          const mainImage = document.getElementById("main-image");
          mainImage.setAttribute("src", imageUrl);
          mainImage.setAttribute("alt", `Listing Image ${index + 1}`);
        });
        listingImgGallery.appendChild(imgElement);
      });
    } else {
      // display a placeholder or fallback image
      const imgElement = document.createElement("img");
      imgElement.src = "fallback-image.jpg";
      imgElement.alt = "Fallback Image";
      imgElement.classList.add("img-fluid");
      listingImgGallery.appendChild(imgElement);
    }

    // Add  bidding form
    const bidListingForm = document.getElementById("bid-listing-form");
    bidListingForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const bidAmountInput = document.getElementById("bid-on-listing");
      const bidAmount = parseFloat(bidAmountInput.value);

      if (!isNaN(bidAmount)) {
        const currentBid = parseFloat(
          document.getElementById("current-bid").textContent
        );
        if (bidAmount <= currentBid) {
          console.error("Bid amount must be higher than the current bid");

          return;
        }

        try {
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            throw new Error("Access token not found.");
          }

          const bidURL = `${API_URL}/auction/listings/${listing.id}/bids`;
          const response = await fetch(bidURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ amount: bidAmount }),
          });

          if (response.ok) {
            // successful bid
            fetchListingDetails(listing.id);
          } else {
            // Handle response
            const responseData = await response.json();
            console.error("Error placing bid:", responseData);

            // Display error messages to the user
            if (responseData.errors && responseData.errors.length > 0) {
              const errorMessage = responseData.errors[0].message;

              console.error("Bid error:", errorMessage);
            } else {
              console.error("Unknown bid error occurred.");
            }
          }
        } catch (error) {
          console.error("Error placing bid:", error);
        }
      } else {
        console.error("Invalid bid amount");
      }
    });
  } catch (error) {
    console.error("Error rendering listing details:", error);
  }
}

// listing ID from URL
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("listingId");

// Fetch and render listing details
if (listingId) {
  fetchListingDetails(listingId);
}
