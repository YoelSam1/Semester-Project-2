import { API_URL } from "./api_url.mjs";

// update a listing
export function updateListing(listingId, updatedData) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Token is null or empty. Please log in again.");
    return Promise.reject("User not authenticated or missing access token.");
  }

  const url = `${API_URL}/auction/listings/${listingId}`;
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updatedData),
  };

  return fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update listing.");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error updating listing:", error);
      throw error;
    });
}

export function deleteListing(listingId) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Token is null or empty. Please log in again.");
    return Promise.reject("User not authenticated or missing access token.");
  }

  const url = `${API_URL}/auction/listings/${listingId}`;
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("User is not authorized to delete this listing.");
        }
        throw new Error("Failed to delete listing.");
      }

      return listingId;
    })
    .catch((error) => {
      console.error("Error deleting listing:", error);
      throw error;
    });
}
