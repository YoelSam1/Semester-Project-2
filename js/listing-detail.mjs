// Import necessary variables and functions
import { API_URL } from "./api_url.mjs";

// Function to fetch single listing details
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
    // Optionally display error message to user
  }
}

// Function to render listing details
function renderListingDetails(listing) {
  try {
    // Populate the listing title
    const listingTitle = document.getElementById("listing-title");
    listingTitle.textContent = listing.title;

    // Populate the listing description
    const listingDescription = document.getElementById("description");
    listingDescription.textContent = listing.description;

    // Populate the current bid
    const currentBid = document.getElementById("current-bid");
    currentBid.textContent =
      listing._count.bids > 0 ? listing._count.bids : "NO BIDS";

    // Calculate and populate time left
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
    // Populate the seller's username if available
    const seller = document.getElementById("listing-seller");
    if (listing.sellerUsername) {
      seller.textContent = listing.sellerUsername;
    } else {
      seller.textContent = "Unknown"; // Or any default value you prefer
    }
    // Populate the image gallery
    const listingImgGallery = document.getElementById("listing-img-gallery");
    listingImgGallery.innerHTML = ""; // Clear previous images
    if (listing.media && listing.media.length > 0) {
      listing.media.forEach((imageUrl, index) => {
        const imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        imgElement.alt = `Listing Image ${index + 1}`;
        imgElement.classList.add("img-fluid");
        imgElement.addEventListener("click", function () {
          // Update the main image with the clicked image
          const mainImage = document.getElementById("main-image");
          mainImage.setAttribute("src", imageUrl);
          mainImage.setAttribute("alt", `Listing Image ${index + 1}`);
        });
        listingImgGallery.appendChild(imgElement);
      });
    } else {
      // If no images are available, display a placeholder or fallback image
      const imgElement = document.createElement("img");
      imgElement.src = "fallback-image.jpg"; // Provide the path to your fallback image
      imgElement.alt = "Fallback Image";
      imgElement.classList.add("img-fluid");
      listingImgGallery.appendChild(imgElement);
    }

    // Add event listener for bidding form submission
    const bidListingForm = document.getElementById("bid-listing-form");
    bidListingForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const bidAmountInput = document.getElementById("bid-on-listing");
      const bidAmount = parseFloat(bidAmountInput.value);

      if (!isNaN(bidAmount)) {
        // Check if the bid amount is higher than the current bid
        const currentBid = parseFloat(
          document.getElementById("current-bid").textContent
        );
        if (bidAmount <= currentBid) {
          console.error("Bid amount must be higher than the current bid");
          // Optionally display error message to user
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
            // Refresh listing details after successful bid
            fetchListingDetails(listing.id);
          } else {
            // Handle non-successful response
            const responseData = await response.json();
            console.error("Error placing bid:", responseData);

            // Display error messages to the user
            if (responseData.errors && responseData.errors.length > 0) {
              const errorMessage = responseData.errors[0].message;
              // Display the error message to the user
              console.error("Bid error:", errorMessage);
            } else {
              console.error("Unknown bid error occurred.");
              // Optionally display a generic error message to the user
            }
          }
        } catch (error) {
          console.error("Error placing bid:", error);
          // Optionally display error message to user
        }
      } else {
        console.error("Invalid bid amount");
        // Optionally display error message to user
      }
    });
  } catch (error) {
    console.error("Error rendering listing details:", error);
    // Optionally display error message to user
  }
}

// Get listing ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("listingId");

// Fetch and render listing details when the page loads
if (listingId) {
  fetchListingDetails(listingId);
}
