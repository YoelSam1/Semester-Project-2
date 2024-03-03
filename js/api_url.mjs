export const API_URL = "https://api.noroff.dev/api/v1";

export const GET_LISTINGS =
  "/listings?_seller=true&_bids=true&sort=created&sortOrder=desc";

// Change user avatar
export function sendAvatarURL(name) {
  return `${API_URL}/auction/profiles/${name}/media`;
}

// Get all listings by profile
export function getListingsByProfileURL(name) {
  return `${API_URL}/auction/profiles/${name}/listings?_seller=true&_bids=true&sort=created&sortOrder=desc&_active=true`;
}

// Get profile
export function getProfileURL(name) {
  return `${API_URL}/auction/profiles/${name}?_listings=true`;
}

// Send bid
export function sendBidURL(listingID) {
  return `${API_BASE_URL}/auction/listings/${listingID}/bids`;
}
